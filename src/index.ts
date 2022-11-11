import "source-map-support/register";
import "./environment";

import Fastify from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import * as env from "env-var";

import { beforeShutdown } from "~util/before-shutdown";
import { logger } from "~util/log";

const fastify = Fastify({
	logger,
	ajv: {
		customOptions: {
			strict: "log",
			keywords: ["kind", "modifer"],
		},
	},
}).withTypeProvider<TypeBoxTypeProvider>();

(async () => {
	await fastify.register(import("./routes"));

	await fastify.listen({
		port: env.get("PORT").asPortNumber()!,
	});
	beforeShutdown(() => fastify.close());
})().catch((error) => logger.fatal(error, "Failed to start"));
