import * as env from "env-var";
import pino from "pino";
import pretty from "pino-pretty";

const streams = [
	env.get("PRETTY_LOGS").asBool()!
		? pretty({
				colorize: true,
		  })
		: pino.destination(process.stdout),
];

const logger = pino(
	{
		level: env.get("LOG_LEVEL").asString(),
	},
	pino.multistream(streams)
);

export { logger };
