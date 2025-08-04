import { drizzle } from "drizzle-orm/d1"
import { Context } from "hono"
import * as schema from "./schema"
import { Bindings } from "./env"
import { and, eq } from "drizzle-orm"
import { verify } from "hono/jwt"
export const generateRandomString = (length: number) => {
	const array = new Uint8Array(length)
	crypto.getRandomValues(array)
	const chars =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~"
	return Array.from(array)
		.map((x) => chars[x % chars.length])
		.join("")
}
const base64URLEncode = (buffer: ArrayBuffer) => {
	return btoa(String.fromCharCode(...new Uint8Array(buffer)))
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "")
}
export const generateCodeChallenge = async (verifier: string) => {
	const encoder = new TextEncoder()
	const data = encoder.encode(verifier)
	const hash = await crypto.subtle.digest("SHA-256", data)
	return base64URLEncode(hash)
}
export function buildDB(c: Context) {
	return drizzle(c.env.DB, { schema: schema })
}

export async function getTwitterUserFromBearer(bearer: string) {
	const url = "https://api.x.com/2/users/me"
	const request = await fetch(url, { headers: { Authorization: bearer } })
	const data = await request.json() as {
		data: {
			created_at: string
			id: string
			name: string
			protected: false
			username: string
		}
	}
	console.log("user data",data)
	if (!data.data) return
	return data
}
export async function getBearerFromServiceToken(
	service_token: string,
	c: Context<{ Bindings: Bindings }>
) {
	let payload: { sub: number }
	try {
		payload = (await verify(
			service_token,
			c.env.JWT_SECRET + "-JWT_SESSION"
		)) as any
	} catch {
		return [false, "service token validation failed"]
	}
	const remote_ip = c.req.header("CF-Connecting-IP")
	if (!remote_ip) return [false, "remote ip undefined"]
	const db = buildDB(c)
	const [session] = await db
		.select()
		.from(schema.sessionsTable)
		.where(
			and(
				eq(schema.sessionsTable.id, payload.sub),
				eq(schema.sessionsTable.ip, remote_ip)
			)
		)
		.limit(1)
	return [session]
}
