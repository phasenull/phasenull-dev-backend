import { Hono } from "hono"
import { CustomContext } from "./env"
import {
	buildDB,
	generateCodeChallenge,
	generateRandomString,
	getTwitterUserFromBearer
} from "./utils"
import { codeChallangesTable, sessionsTable } from "./schema"
import { sign, verify } from "hono/jwt"
import { and, desc, eq, isNull } from "drizzle-orm"
import { AuthMiddleware } from "./auth.middleware"

const AdminController = new Hono<CustomContext>()
AdminController.use("/*", AuthMiddleware)

AdminController.get("/test", async (c) => {
	return c.json({ success: true, message: "Admin test route" })
})
AdminController.get("/whoami", async (c) => {
	const payload = c.get("jwtPayload")
	const db = buildDB(c)
	const [user] = await db
		.select()
		.from(sessionsTable)
		.where(eq(sessionsTable.id, payload.sub))
		.limit(1)
	if (!user) {
		return c.json({ success: false, message: "User not found." }, 404)
	}
	if (!user) return c.json({ success: false, message: "User not found." }, 404)

	// const twitter_user = await getTwitterUserFromBearer(`Bearer ${user.bearer}`)
	// if (!twitter_user) return c.json({ success: false, message: "Twitter user not found." }, 404)
	return c.json({ success: true, user: user.data })
})
AdminController.get("/list-sessions", async (c) => {
	const page = c.req.query("page") ? Math.max(0, parseInt(c.req.query("page") as string)) : 1
	const db = buildDB(c)
	const sessions = await db.select().from(sessionsTable).orderBy(desc(sessionsTable.created_at)).limit(100).offset((page - 1) * 100)

	// const twitter_user = await getTwitterUserFromBearer(`Bearer ${user.bearer}`)
	// if (!twitter_user) return c.json({ success: false, message: "Twitter user not found." }, 404)
	return c.json({
		success: true,
		sessions: sessions.map((e) => ({
			...e,
			bearer: null,
			data: { ...(e.data as any), access_token: undefined }
		}))
	})
})
AdminController.get("/usage", async (c) => {
	const page = c.req.query("page") ? Math.max(0, parseInt(c.req.query("page") as string)) : 1
	const db = buildDB(c)
	const [session] = await db.select().from(sessionsTable).limit(1).where(eq(sessionsTable.id, c.get("jwtPayload").sub))
	console.log(c.env.BEARER_TOKEN.split(0,10))
	const tweets_promise = fetch("https://api.x.com/2/usage/tweets?days=30", {
		headers: {
			"Authorization": `Bearer ${c.env.BEARER_TOKEN}`
		}
	})
	const [tweets] = await Promise.all([(await tweets_promise).json() as any])
	console.log(tweets)
	if (!tweets.data) return c.json({ success: false, message: "Twitter API error." }, 500)
	return c.json({
		success:true,
		usage:tweets.data
	})
})
export default AdminController
