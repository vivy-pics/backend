import { createClient } from "edgedb";

export const client = createClient();

export { default as e } from "~generated/edgeql";
