import { Context } from "hono"
import { BlankEnv, Env } from "hono/types"

export interface Bindings {
	BUCKET: R2Bucket
	BUCKET_DEV: R2Bucket
	DB: D1Database
	LINKEDIN_KEY:string
	PORTFOLIO_URL:string
	API_URL:string
	TWITTER_CLIENT_ID:string
	TWITTER_CLIENT_SECRET:string
	JWT_SECRET:string

	// username for the admin account (NOT USER LABEL OR ID)
	TWITTER_USERNAME:string
}

export {}
