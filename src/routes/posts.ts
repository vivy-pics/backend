import crypto from "node:crypto";

import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { AWSError } from "aws-sdk";
import * as env from "env-var";
import type { FastifyPluginAsync } from "fastify";
import sharp from "sharp";

import { client, e } from "~util/database";
import { S3 } from "~util/s3";
import { logger } from "~util/log";

const plugin: FastifyPluginAsync = async (fastify, _options) => {
	const f = fastify.withTypeProvider<TypeBoxTypeProvider>();

	// submitting a new image
	f.post("/", async (request, reply) => {
		const file = await request.file();

		if (!file) {
			return reply.code(400).send({ error: "no file" });
		}

		if (!file.mimetype.startsWith("image/")) {
			return reply.code(400).send({ error: "not an image" });
		}

		const fileBuffer = await file.toBuffer();
		let normalisedMimeType = file.mimetype;
		let normalisedFile = fileBuffer;

		if (
			file.mimetype !== "image/gif" &&
			file.mimetype !== "image/png" &&
			file.mimetype !== "image/jpeg"
		) {
			normalisedFile = await sharp(fileBuffer).png().toBuffer();
			normalisedMimeType = "image/png";
		}

		const processedHash = crypto
			.createHash("sha256")
			.update(normalisedFile)
			.digest("hex");

		try {
			await S3.headObject({
				Bucket: env.get("S3_BUCKET").asString()!,
				Key: processedHash,
			}).promise();

			// if we get here, then the file already exists
			// just create a new post pointing to this hash

			await e
				.insert(e.Post, {
					hash: processedHash,
					owner: e.select(e.User, (user) => ({
						filter_single: e.op(user.number, "=", 1),
					})),
				})
				.run(client);

			return {};
		} catch (error) {
			if ((error as AWSError).statusCode !== 404) {
				logger.error(
					{ key: processedHash, error },
					"Failed to HEAD object"
				);

				return reply.code(500).send({ error: "S3 error" });
			}
		}

		try {
			await S3.putObject({
				Bucket: env.get("S3_BUCKET").asString()!,
				Key: processedHash,
				Body: normalisedFile,
				ContentType: normalisedMimeType,
			}).promise();
		} catch (error) {
			logger.error({ key: processedHash, error }, "Failed to PUT object");

			return reply.code(500).send({ error: "S3 error" });
		}

		return {};
	});

	// for the front page, we want to render the newest posts
	f.get("/new", async (_request, _reply) => {
		// we're grabbing the minimum amount of data here to render the front page since it's very minimalist
		const posts = await e
			.select(e.Post, (post) => ({
				number: true,
				hash: true,
				posted_at: true,
				likes: true,

				filter: e.op(
					e.op(post.soft_deleted, "=", false),
					"and",
					e.op(post.nsfw, "=", false)
				),
				order_by: post.posted_at,
				limit: 50,
			}))
			.run(client);

		return posts;
	});

	f.get(
		"/:id",
		{
			schema: {
				params: Type.Object({
					id: Type.Number(),
				}),
			},
		},
		async (request, reply) => {
			const potentialPost = await e
				.select(e.Post, (post) => ({
					number: true,
					soft_deleted: true,
					hash: true,
					posted_at: true,
					likes: true,
					deleted_at: true,
					deletion_reason: true,
					owner: { number: true },
					variant_of: { number: true },

					filter_single: e.op(post.number, "=", request.params.id),
				}))
				.run(client);

			if (!potentialPost) {
				return reply.code(404).send();
			}

			return potentialPost;
		}
	);
};

export default plugin;
