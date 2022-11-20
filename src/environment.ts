/* eslint-disable import/first */
// eslint-disable-next-line import/order
import dotenv from "dotenv";

dotenv.config();

import * as env from "env-var";

import { logger } from "~util/log";
/* eslint-enable import/first */

try {
	env.get("PRETTY_LOGS").required().asBool();
	env.get("LOG_LEVEL").required().asString();
	env.get("PORT").required().asPortNumber();

	if (env.get("SESSION_SECRET").required().asString().length < 32) {
		throw new Error("SESSION_SECRET must be at least 32 characters long");
	}

	env.get("SESSION_EXPIRY").required().asIntPositive();

	env.get("EDGEDB_DSN").asUrlString();
	env.get("REDIS_DSN").required().asUrlString();

	env.get("S3_ENDPOINT").required().asUrlString();
	env.get("S3_ACCESS_KEY_ID").required().asString();
	env.get("S3_SECRET_ACCESS_KEY").required().asString();
	env.get("S3_BUCKET").required().asString();

	env.get("TURNSTILE_SECRET_KEY").required().asString();
} catch (error) {
	logger.fatal(error, "Failed to configure environment");

	// eslint-disable-next-line unicorn/no-process-exit
	process.exit(-1);
}

logger.debug("Environment configured");
