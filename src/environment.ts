/* eslint-disable import/first */
// eslint-disable-next-line import/order
import dotenv from "dotenv";

dotenv.config();

import * as env from "env-var";

import { logger } from "~util/log";
/* eslint-enable import/first */

try {
	env.get("LOG_LEVEL").required().asString();
	env.get("PORT").required().asPortNumber();

	env.get("EDGEDB_DSN").asString();
} catch (error) {
	logger.fatal(error, "Failed to configure environment");

	// eslint-disable-next-line unicorn/no-process-exit
	process.exit(-1);
}

logger.debug("Environment configured");
