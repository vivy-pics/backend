import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsync } from "fastify";

import { client, e } from "~util/database";

const plugin: FastifyPluginAsync = async (fastify, _options) => {
	const f = fastify.withTypeProvider<TypeBoxTypeProvider>();

	// for the front page, we want to render the newest posts
	f.get("/new", async (_request, _reply) => {
		// we're grabbing the minimum amount of data here to render the front page since it's very minimalist
		const query = e.select(e.Post, (post) => ({
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
		}));

		const posts = await query.run(client);

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
			const query = e.select(e.Post, (post) => ({
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
			}));

			const post = await query.run(client);

			if (!post) {
				return reply.code(404).send();
			}

			return post;
		}
	);
};

export default plugin;
