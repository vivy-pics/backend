import Axios from "axios";
import * as env from "env-var";

type SuccessfulTurnstile = [success: true, action: string, data?: string];
type FailedTurnstile = [success: false];

export async function verifyTurnstile(
	token: string,
	ip: string
): Promise<SuccessfulTurnstile | FailedTurnstile> {
	const body = new URLSearchParams();
	body.set("secret", env.get("TURNSTILE_SECRET_KEY").asString()!);
	body.set("response", token);
	body.set("remoteip", ip);

	const response = await Axios.post<{
		success: boolean;
		action?: string;
		cdata?: string;
	}>("https://challenges.cloudflare.com/turnstile/v0/siteverify", body);

	return response.data.success
		? [true, response.data.action!, response.data.cdata]
		: [false];
}
