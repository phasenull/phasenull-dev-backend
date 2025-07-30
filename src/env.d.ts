import { Context } from "hono"
import { BlankEnv, Env } from "hono/types"

export interface Bindings {
	BUCKET: R2Bucket
	BUCKET_DEV: R2Bucket
	DB: D1Database
}

export {}
