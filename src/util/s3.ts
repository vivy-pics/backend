import S3Client from "aws-sdk/clients/s3";
import * as env from "env-var";

export const S3 = new S3Client({
	endpoint: env.get("S3_ENDPOINT").asUrlString()!,
	accessKeyId: env.get("S3_ACCESS_KEY_ID").asString()!,
	secretAccessKey: env.get("S3_SECRET_ACCESS_KEY").asString()!,
	signatureVersion: "v4",
});
