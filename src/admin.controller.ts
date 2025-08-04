import { Hono } from "hono"
import { Bindings } from "./env"
import {
	buildDB,
	generateCodeChallenge,
	generateRandomString,
	getTwitterUserFromBearer
} from "./utils"
import { codeChallangesTable, sessionsTable } from "./schema"
import { sign, verify } from "hono/jwt"
import { and, eq, isNull } from "drizzle-orm"

const AdminController = new Hono<{ Bindings: Bindings }>()

AdminController.get("/oauth/callback", async (c) => {
	const code = c.req.query("code")
	const state = c.req.query("state")
	if (!(code && state))
		return c.json(
			{ success: false, message: "code or state parameter is missing." },
			400
		)
	let verified_payload
	try {
		verified_payload = await verify(state, c.env.JWT_SECRET)
	} catch (e) {
		return c.json(
			{ success: false, message: "request has expired or invalid." },
			400
		)
	}
	if (!verified_payload)
		return c.json(
			{ success: false, message: "request has expired or invalid." },
			400
		)
	const db = buildDB(c)
	const remote_ip = c.req.header("CF-Connecting-IP") as string
	if (!remote_ip) return c.json({ success: false, message: "invalid ip." }, 400)
	const secret = verified_payload.secret as number
	const [entry] = await db
		.select()
		.from(codeChallangesTable)
		.where(
			and(
				eq(codeChallangesTable.id, secret),
				eq(codeChallangesTable.ip, remote_ip),
				isNull(codeChallangesTable.used_at)
			)
		)
		.limit(1)
	const form_data = new URLSearchParams()
	form_data.set("code", code)
	form_data.set("grant_type", "authorization_code")
	form_data.set("client_id", c.env.TWITTER_CLIENT_ID)
	form_data.set(
		"redirect_uri",
		`${c.env.PORTFOLIO_URL}` + "/admin/oauth/callback"
	)
	form_data.set("code_verifier", entry.secret)

	const url = `https://api.x.com/2/oauth2/token?${form_data.toString()}`
	const request = await fetch(url, {
		headers: {
			"Content-Type": "application/x-www-form-urlencoded"
		},
		// body:form_data,
		method: "POST"
	})
	const response = (await request.json()) as {
		token_type: "bearer"
		expires_in: 7200
		access_token: string
		scope: "tweet.read"
	}
	if (!response.access_token)
		return c.json(
			{
				success: false,
				message: "twitter api did not return an access token"
			},
			400
		)
	if (
		!(
			response.scope.includes("tweet.read") &&
			response.scope.includes("tweet.read")
		)
	)
		return c.json({ success: false, message: "scope is not valid" }, 400)
	const token = response.access_token
	const user = await getTwitterUserFromBearer(`Bearer ${token}`)
	if (!user)
		return c.json(
			{
				success: false,
				message:
					"twitter /users/me request failed or did not return a valid user"
			},
			400
		)
	if (user.data.username !== c.env.TWITTER_USERNAME)
		return c.json(
			{
				success: false,
				message:
					"You are not allowed to see this page, if you are the portfolio owner please put your twitter username with key TWITTER_USERNAME in your .env file."
			},
			403
		)
	const [result] = await db
		.insert(sessionsTable)
		.values({
			bearer: token,
			ip: remote_ip,
			account_userid: user?.data.id,
			account_username: user?.data.name
		})
		.returning()
	const service_access_token = await sign(
		{
			exp: Math.floor(Date.now() / 1000) + response.expires_in,
			sub: result.id
		},
		c.env.JWT_SECRET + "-JWT_SESSION"
	)
	return c.json({
		success: true,
		access_token: service_access_token,
		user: user
	})
})
AdminController.get("/oauth/authorize", async (c) => {
	if (!c.env.JWT_SECRET)
		return c.json(
			{ success: false, message: "JWT_SECRET is undefined in .env" },
			500
		)
	if (!(c.env.TWITTER_CLIENT_ID && c.env.TWITTER_CLIENT_SECRET))
		return c.json(
			{
				success: false,
				message:
					"TWITTER_CLIENT_ID or TWITTER_CLIENT_SECRET is undefined in .env"
			},
			500
		)
	const new_verifier = generateRandomString(20)
	const db = buildDB(c)
	const [entry] = await db
		.insert(codeChallangesTable)
		.values({
			secret: new_verifier,
			ip: c.req.header("CF-Connecting-IP")
		})
		.returning()
	const jwt = await sign(
		{
			iat: Math.floor(Date.now() / 1000),
			exp: Math.floor(Date.now() / 1000) + 15 * 60,
			secret: entry.id
		},
		c.env.JWT_SECRET
	)
	const hash = await generateCodeChallenge(new_verifier)
	const oauth_url = new URL(`https://x.com/i/oauth2/authorize`)
	oauth_url.searchParams.set("response_type", "code")
	oauth_url.searchParams.set("client_id", c.env.TWITTER_CLIENT_ID)
	oauth_url.searchParams.set(
		"redirect_uri",
		`https://phasenull.dev/admin/oauth/callback`
	)
	oauth_url.searchParams.set("scope", "tweet.read users.read")
	oauth_url.searchParams.set("state", jwt)
	oauth_url.searchParams.set("code_challenge", hash)
	oauth_url.searchParams.set("code_challenge_method", "S256")
	return c.json({
		success: true,
		url: oauth_url.toString()
	})
})
export default AdminController
