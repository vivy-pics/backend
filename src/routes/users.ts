import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsync } from "fastify";

import { client, e } from "~util/database";
import { hash } from "~util/hashing";
import { verifyCaptcha } from "~util/recaptcha";

const plugin: FastifyPluginAsync = async (fastify, _options) => {
	const f = fastify.withTypeProvider<TypeBoxTypeProvider>();

	f.post(
		"/",
		{
			schema: {
				body: Type.Object({
					username: Type.String({ maxLength: 32 }),
					password: Type.String(),
					email: Type.String({ format: "email" }),
				}),
			},
		},
		async (request, reply) => {
			const { username: usernameRaw, password, email } = request.body;
			const username = usernameRaw.trim();

			const potentialUser = await e
				.select(e.User, (user) => ({
					filter_single: e.op(
						e.op(user.clean_username, "=", username.toLowerCase()),
						"or",
						e.op(user.clean_email, "=", email.toLowerCase())
					),
				}))
				.run(client);

			if (potentialUser) {
				return reply.status(409).send({
					error: "Username or email already taken.",
				});
			}

			const passwordHash = await hash(password);

			await e
				.insert(e.User, {
					username,
					password_hash: passwordHash,
					email,
				})
				.run(client);

			return reply.status(204);
		}
	);

	f.post(
		"/verify",
		{
			schema: {
				body: Type.Object({
					token: Type.String(),
					recaptcha: Type.String(),
				}),
			},
		},
		async (request, reply) => {
			if (!request.session.user) {
				return reply.status(401).send({
					error: "Not logged in.",
				});
			}

			if (!(await verifyCaptcha(request.body.recaptcha, request.ip))) {
				return reply.status(400).send({
					error: "Recaptcha failed",
				});
			}

			return {};
		}
	);

	f.get("/me", async (request, reply) => {
		if (!request.session.user) {
			return reply.status(401).send({ error: "Not authenticated" });
		}

		return request.session.user;
	});

	f.post("/logout", async (request, reply) => {
		if (!request.session.user) {
			return reply.status(400).send({ error: "Not logged in" });
		}

		await request.session.destroy();
		return reply.status(204);
	});
};

export default plugin;
