import { Context, Next } from "hono"
import { verify } from "hono/jwt"
import { CustomContext } from "./env"

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
      payload = await verify(value, c.env.JWT_SECRET+"-JWT_SESSION")
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
	c.set("jwtPayload", payload)
	await next()
}
