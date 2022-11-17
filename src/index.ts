import "source-map-support/register";
import "./environment";

import Fastify from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import FastifyCookie from "@fastify/cookie";
import FastifyCors from "@fastify/cors";
import FastifyMultipart from "@fastify/multipart";
import FastifySession from "@fastify/session";
import Redis from "ioredis";
import * as env from "env-var";

import { RedisStore } from "./redis-store";

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
	await fastify.register(FastifyCors, {
		origin: true,
	});
	await fastify.register(FastifyMultipart);
	await fastify.register(FastifyCookie);
	// the auto options here are for development. please do not run this on a HTTP-potential server.
	await fastify.register(FastifySession, {
		cookieName: "session",
		cookie: {
			secure: "auto",
			sameSite: "strict",
			maxAge: env.get("SESSION_EXPIRY").asInt()! * 60 * 60 * 24 * 1000,
		},
		secret: env.get("SESSION_SECRET").asString()!,
		store: new RedisStore({
			client: new Redis(env.get("REDIS_DSN").asString()!, {
				enableAutoPipelining: true,
			}),
			prefix: "session",
			ttl: env.get("SESSION_EXPIRY").asInt()! * 60 * 60 * 24 * 1000,
		}),
	});

	fastify.addHook("onRequest", (request, _, next) => {
		request.session.touch();
		next();
	});

	await fastify.register(import("./routes"));

	await fastify.listen({
		port: env.get("PORT").asPortNumber()!,
	});
	beforeShutdown(() => fastify.close());
})().catch((error) => logger.fatal(error, "Failed to start"));
