import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsync } from "fastify";

import { client, e } from "~util/database";
import { hash } from "~util/hashing";

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

			const user = (await e
				.insert(e.User, {
					username,
					password_hash: passwordHash,
					email,
				})
				.run(client)
				.then((result) =>
					e
						.select(e.User, (_) => ({
							number: true,
							filter_single: { id: result.id },
						}))
						.run(client)
				))!;

			return user;
		}
	);
};

export default plugin;
