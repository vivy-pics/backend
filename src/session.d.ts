declare module "fastify" {
	interface Session {
		user: {
			id: number;
		};
	}
}

export {};
