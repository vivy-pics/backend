import * as os from "node:os";

import * as argon2 from "argon2";

const settings: argon2.Options = {
	type: argon2.argon2id,
	parallelism: os.cpus().length * 2, // as per recommendation from the argon2 RFC
};

export function hash(password: string) {
	return argon2.hash(password, { ...settings, raw: false });
}

// eslint-disable-next-line @typescript-eslint/no-shadow -- shadowing is intentional here for naming
export function verify(hash: string, password: string) {
	return argon2.verify(hash, password);
}
