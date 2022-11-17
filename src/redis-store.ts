import type * as Fastify from "fastify";
import type FastifySessionPlugin from "@fastify/session";
import type { Redis } from "ioredis";

type CallbackN = (error?: Error) => void;
type Callback<T> = (error: Error | null, result: T) => void;

export class RedisStore implements FastifySessionPlugin.SessionStore {
	private redisClient: Redis;

	private prefix: string;

	private ttl: number;

	constructor({
		client,
		prefix,
		ttl,
	}: {
		client: Redis;
		prefix: string;
		ttl: number;
	}) {
		this.redisClient = client;
		this.prefix = `${prefix}:`;
		this.ttl = ttl;
	}

	async set(
		sessionId: string,
		session: Fastify.Session,
		callback: CallbackN
	): Promise<void> {
		try {
			await this.redisClient.set(
				this.prefix + sessionId,
				JSON.stringify(session)
			);
			await this.redisClient.pexpire(this.prefix + sessionId, this.ttl);
			callback();
		} catch (error) {
			callback(error as Error);
		}
	}

	// eslint-disable-next-line consistent-return
	async get(
		sessionId: string,
		callback: Callback<Fastify.Session>
	): Promise<void> {
		/* eslint-disable @typescript-eslint/ban-ts-comment */
		let sessionData;

		try {
			[, [, sessionData]] = (await this.redisClient
				.pipeline()
				.pexpire(this.prefix + sessionId, this.ttl)
				.get(this.prefix + sessionId)
				.exec())!;
		} catch (error) {
			// @ts-ignore
			if (error) callback(error);
		}

		// @ts-ignore
		if (!sessionData) return callback();

		try {
			// @ts-ignore
			callback(undefined, JSON.parse(sessionData) as Fastify.Session);
		} catch (error) {
			// @ts-ignore
			callback(error as Error);
		}

		/* eslint-enable @typescript-eslint/ban-ts-comment */
	}

	async destroy(sessionId: string, callback: CallbackN): Promise<void> {
		await this.redisClient.del(this.prefix + sessionId);
		callback();
	}
}
