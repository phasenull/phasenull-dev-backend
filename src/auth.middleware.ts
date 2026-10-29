import { Context, Next } from "hono"
import { verify } from "hono/jwt"
import { eq } from "drizzle-orm"
import { CustomContext } from "./env"
import { buildDB } from "./utils"
import { sessionsTable } from "./schema"

// hono middleware
export const AuthMiddleware = async (c: CustomContext, next: Next) => {
	const token = c.req.header("Authorization")
	if (!token) {
		return c.json(
			{ success: false, message: "Authorization header is missing." },
			401
		)
	}
	const [type, value] = token.split(" ")
	if (type !== "Bearer" || !value) {
		return c.json(
			{ success: false, message: "Invalid Authorization header format." },
			401
		)
	}
   let payload
   try {
      payload = await verify(value, c.env.JWT_SECRET+"-JWT_SESSION", "HS256")
   } catch {
      return c.json(
         { success: false, message: "Invalid token." },
         401
      )
   }
   if (!payload) {
      return c.json(
         { success: false, message: "Invalid token." },
         401
      )
   }
	// the session must still exist (delete the row to revoke) and belong to the portfolio owner
	const db = buildDB(c)
	const [session] = await db
		.select({ account_username: sessionsTable.account_username })
		.from(sessionsTable)
		.where(eq(sessionsTable.id, payload.sub as number))
		.limit(1)
	if (!session || session.account_username !== c.env.TWITTER_USERNAME) {
		return c.json({ success: false, message: "Invalid token." }, 401)
	}
	c.set("jwtPayload", payload)
	await next()
}
