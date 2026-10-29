import { Next } from "hono"
import { CustomContext } from "./env"

// per-ip limit for the oauth and admin routes, backed by the RATE_LIMITER binding in wrangler.jsonc
export const RateLimitMiddleware = async (c: CustomContext, next: Next) => {
	const limiter = c.env.RATE_LIMITER
	// binding is missing in some local setups, don't block requests there
	if (!limiter) return await next()
	const remote_ip = c.req.header("CF-Connecting-IP") || "unknown"
	const { success } = await limiter.limit({ key: remote_ip })
	if (!success) {
		return c.json(
			{ success: false, message: "Too many requests, try again later." },
			429
		)
	}
	await next()
}
