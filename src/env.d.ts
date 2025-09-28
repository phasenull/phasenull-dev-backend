import { Context } from "hono"
import { BlankEnv, Env } from "hono/types"

interface Bindings {
	BUCKET: R2Bucket
	BUCKET_DEV: R2Bucket
	DB: D1Database
	LINKEDIN_KEY:string
	PORTFOLIO_URL:string
	R2: R2Bucket
	API_URL:string
	TWITTER_CLIENT_ID:string
	TWITTER_CLIENT_SECRET:string
	JWT_SECRET:string
	KV: KVNamespace
	BEARER_TOKEN:string
	// username for the admin account (NOT USER LABEL OR ID)
	TWITTER_USERNAME:string
}
interface Variables {
	
}
export type CustomContext = Env<{ Bindings: Bindings,Variables: Variables }>

export {}
