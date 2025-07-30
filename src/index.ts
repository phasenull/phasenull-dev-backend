import { Hono } from "hono"
import { Bindings } from "./env"
import { drizzle } from "drizzle-orm/d1"
import { projectsTable, projectToStackTable, stackTable } from "./schema"
import * as schema from "./schema"
import { eq, inArray } from "drizzle-orm"
const app = new Hono<{ Bindings: Bindings }>()

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

export default app
