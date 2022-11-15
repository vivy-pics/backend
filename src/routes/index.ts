import fs from "node:fs";

import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import type { FastifyPluginAsync } from "fastify";

const version = (() => {
	// eslint-disable-next-line unicorn/prevent-abbreviations
	const ref = fs.readFileSync(".git/HEAD", "utf8").trim();
	if (!ref.includes(":")) {
		return ref.slice(0, 7);
	}

	return fs
		.readFileSync(`.git/${ref.slice(5)}`, "utf8")
		.trim()
		.slice(0, 7);
})();

const plugin: FastifyPluginAsync = async (fastify, _options) => {
	const f = fastify.withTypeProvider<TypeBoxTypeProvider>();

	await f.register(import("./posts"), { prefix: "/posts" });
	await f.register(import("./users"), { prefix: "/users" });

	f.get("/", async () => ({
		pong: true,
		vivy: "What does it mean to put your heart into something?",
	}));

	f.get("/version", async () => ({ version }));
};

export default plugin;
