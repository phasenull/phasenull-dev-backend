import { Hono } from "hono"
import { Bindings } from "./env"
import { drizzle } from "drizzle-orm/d1"
import { projectsTable, projectToStackTable, stackTable } from "./schema"
import * as schema from "./schema"
import { desc, eq, inArray } from "drizzle-orm"
import { cors } from "hono/cors"
import AdminController from "./admin.controller"
const app = new Hono<{ Bindings: Bindings }>()
app.use(
	cors({
		allowMethods: ["GET"],
		origin: [
			"http://localhost:5173",
			"https://phasenull.dev",
			"https://www.phasenull.dev"
		]
	})
)
app.get("/status", (c) => {
	return c.json({ success: true })
})

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
	const db = drizzle(c.env.DB, { schema })
	const projects = await db.select().from(projectsTable)
	const stacks = await db.select().from(stackTable)
	const relations = await db.select().from(projectToStackTable)
	return c.json({
		success: true,
		projects: projects,
		stacks: stacks,
		relations: relations
	})
})

app.get("/projects/:id", async (c) => {
	const { id } = c.req.param()
	const db = drizzle(c.env.DB, { schema })
	const projects = await db.select().from(projectsTable)
	const stacks = await db.select().from(stackTable)
	const relations = await db.select().from(projectToStackTable)
	return c.json({
		success: true,
		projects: projects,
		stacks: stacks,
		relations: relations
	})
})

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
	const [activities, media_list] = await Promise.all(
		[promise_activities,
		promise_media_list]
	)
	return c.json({
		success: true,
		activity_list: activities || [],
		media_list: media_list || []
	})
})

app.route("/admin",AdminController)

export default app
