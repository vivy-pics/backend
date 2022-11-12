import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import type { FastifyPluginAsync } from "fastify";

const plugin: FastifyPluginAsync = async (fastify, _options) => {
	const f = fastify.withTypeProvider<TypeBoxTypeProvider>();

	await f.register(import("./posts"), { prefix: "/posts" });
	await f.register(import("./users"), { prefix: "/users" });

	f.get("/", async () => ({
		pong: true,
		vivy: "What does it mean to put your heart into something?",
	}));
};

export default plugin;
