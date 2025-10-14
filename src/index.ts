import { Hono } from "hono"
import { drizzle } from "drizzle-orm/d1"
import { projectsTable, projectToStackTable, stackTable } from "./schema"
import * as schema from "./schema"
import { desc, eq, inArray, not } from "drizzle-orm"
import { cors } from "hono/cors"
import AdminController from "./admin.controller"
import { CustomContext } from "./env"
import OAuthController from "./auth.controller"
import { HOSTNAME, PORTFOLIO_URL } from "./constants"
import { readFile, readFileSync } from "fs"
const app = new Hono<CustomContext>()
app.use(
	cors({
		allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
		origin: [
			"http://localhost:5173",
			`${PORTFOLIO_URL}`,
			`https://www.${HOSTNAME}`,
			"https://phasenull-dev-frontend.phasenull.workers.dev"
		]
	})
)
app.get("/status", (c) => {
	return c.json({ success: true })
})

app.route("/admin", AdminController)
app.route("/oauth", OAuthController)
app.get("/projects/search", async (c) => {
	const stacks_raw = c.req.query("stacks")
	if (!stacks_raw)
		return c.json({
			success: true,
			projects: [],
			message: "Cant find search param: stacks"
		})
	const stacks_array = stacks_raw.split(",").map((e) => parseInt(e))
	const db = drizzle(c.env.DB, { schema })
	const projects = await db
		.select()
		.from(projectToStackTable)
		.where(inArray(projectToStackTable.stack_id, stacks_array))
		.leftJoin(
			projectsTable,
			eq(projectsTable.id, projectToStackTable.project_id)
		)
	return c.json({ success: true, projects: projects })
})
app.get("/projects/all", async (c) => {
	const is_invalidate = c.req.query("invalidate")
	const KV = c.env.KV
	const cached = await KV.get("projects_all")
	if (cached && cached !== "undefined" && !is_invalidate) {
		try {
			const parsed = JSON.parse(cached) as { data: any; created_at: string }
			if (
				parsed.created_at &&
				new Date().getTime() - new Date(parsed.created_at).getTime() <
					1000 * 60 * 60 * 24 * 7
			) {
				return c.json(parsed.data)
			}
		} catch (e) {
			console.error("Error parsing cached projects_all:", e)
		}
	}
	const db = drizzle(c.env.DB, { schema })
	const projects = await db
		.select()
		.from(projectsTable)
		.where(eq(projectsTable.is_visible, true))
	const stacks = await db.select().from(stackTable)
	const relations = await db.select().from(projectToStackTable)

	const sortedProjects = projects.sort((a, b) => {
		if (a.project_end_date === null && b.project_end_date === null) return 0
		if (a.project_end_date === null) return -1
		if (b.project_end_date === null) return 1
		return (
			(b.project_end_date?.getTime() || 0) -
			(a.project_end_date?.getTime() || 0)
		)
	})

	await KV.put(
		"projects_all",
		JSON.stringify({
			data: {
				success: true,
				projects: sortedProjects,
				stacks: stacks,
				relations: relations
			},
			created_at: new Date().toISOString()
		})
	)
	return c.json({
		success: true,
		projects: sortedProjects,
		stacks: stacks,
		relations: relations
	})
})
const header = `<?xml version="1.0" encoding="UTF-8"?>

<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`
app.get("/generate-sitemap", async (c) => {
	const db = drizzle(c.env.DB, { schema })
	const projects = await db
		.select()
		.from(projectsTable)
		.where(not(eq(projectsTable.is_visible, false)))
	if (!projects) {
		return c.json({ success: false, message: "No projects found" }, 404)
	}
	const static_pages = [`${PORTFOLIO_URL}/pinboard`, 
		// `${PORTFOLIO_URL}/career`

	]
	const prioritized_pages = static_pages.map((url) =>
		buildUrlXML(url, 0.9, "weekly", new Date().toISOString())
	)
	const xmls = projects.map((project) => {
		const loc = `${PORTFOLIO_URL}/projects/${project.id}/${project.title
			?.toLowerCase()
			.replace(/\s+/g, "-")}`
		const priority = 0.3
		const changefreq: sitemap.changefreq = "weekly"
		const lastmod =
			project?.created_at?.toISOString() || new Date().toISOString()
		return buildUrlXML(loc, priority, changefreq, lastmod)
	})
	const footer = `</urlset>`
	const sitemap =
		header +
		buildUrlXML(`${PORTFOLIO_URL}`, 1.0, "weekly", new Date().toISOString()) +
		prioritized_pages.join("\n") +
		xmls.join("\n") +
		footer
	return c.body(sitemap, 200, { "Content-Type": "application/xml" })
})
namespace sitemap {
	export type changefreq =
		| "always"
		| "hourly"
		| "daily"
		| "weekly"
		| "monthly"
		| "yearly"
		| "never"
}
function buildUrlXML(
	loc: string,
	priority: number,
	changefreq: sitemap.changefreq,
	lastmod?: string
) {
	return `<url>
	<loc>${loc}</loc>
	<changefreq>${changefreq}</changefreq>
	<priority>${priority}</priority>
	${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}
</url>`
}

app.get("/social/get-recent-activities", async (c) => {
	const db = drizzle(c.env.DB, { schema })
	const promise_activities = db
		.select()
		.from(schema.activitiesTable)
		.orderBy(desc(schema.activitiesTable.created_at))
		.limit(100)
	const promise_media_list = db
		.select()
		.from(schema.activitiesMediaTable)
		.orderBy(desc(schema.activitiesMediaTable.created_at))
		.limit(100)
	const [activities, media_list] = await Promise.all([
		promise_activities,
		promise_media_list
	])
	return c.json({
		success: true,
		activity_list: activities || [],
		media_list: media_list || []
	})
})

export default app
