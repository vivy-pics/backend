import Axios from "axios";
import * as env from "env-var";

export async function verifyCaptcha(token: string, ip: string) {
	const body = new URLSearchParams();
	body.set("secret", env.get("RECAPTCHA_SECRET_KEY").asString()!);
	body.set("response", token);
	body.set("remoteip", ip);

	const response = await Axios.post<{ success: boolean }>(
		"https://www.google.com/recaptcha/api/siteverify",
		body
	);

	return response.data.success;
}
