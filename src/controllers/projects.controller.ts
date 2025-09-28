import { Hono } from "hono"
import { CustomContext } from "../env"
import { buildDB } from "../utils"
import { projectsTable, projectToStackTable, stackTable } from "../schema"
import { asc, desc, eq, inArray } from "drizzle-orm"
import { RowData } from "../data-table.types"

const ProjectsController = new Hono<CustomContext>()
ProjectsController.get("/:id", async (c) => {
	const { id } = c.req.param()
	if (!id || isNaN(parseInt(id))) {
		return c.json({ success: false, message: "Invalid stack ID" }, 400)
	}
	const db = buildDB(c)
	const [project] = await db
		.select()
		.from(projectsTable)
		.where(eq(projectsTable.id, parseInt(id)))
		.limit(1)
	const stacks = await db.select().from(stackTable).orderBy(asc(stackTable.id))
	const relations = await db
		.select()
		.from(projectToStackTable)
		.where(eq(projectToStackTable.project_id, parseInt(id)))
	if (!project) {
		return c.json({ success: false, message: "Project not found" }, 404)
	}
	return c.json({
		success: true,
		project,
		stacks: stacks,
		relations: relations.filter((r) => r.project_id === project.id)
	})
})

ProjectsController.get("/", async (c) => {
	const db = buildDB(c)
	const projects = await db
		.select()
		.from(projectsTable)
		.orderBy(asc(projectsTable.id))
	return c.json({ success: true, projects })
})
async function reloadCache(c: CustomContext) {
	const KV = c.env.KV as KVNamespace
	const db = buildDB(c)
	const stacks = await db.select().from(stackTable)
	const relations = await db.select().from(projectToStackTable)
	const projects = await db.select().from(projectsTable).orderBy(desc(projectsTable.project_end_date))
	await KV.put(
		"projects_all",
		JSON.stringify({
			data: {
				success: true,
				stacks: stacks,
				relations: relations,
				projects: projects
			},
			created_at: new Date().toISOString()
		})
	)
	return { stacks, relations, projects }
}
ProjectsController.delete("/:id", async (c) => {
	const { id } = c.req.param()
	if (!id || isNaN(parseInt(id))) {
		return c.json({ success: false, message: "Invalid project ID" }, 400)
	}
	const db = buildDB(c)
	const [deleted] = await db
		.delete(projectsTable)
		.where(eq(projectsTable.id, parseInt(id)))
		.returning()
	if (!deleted) {
		return c.json({ success: false, message: "No project found" }, 404)
	}
	return c.json({
		success: true,
		message: "Project deleted successfully",
		deleted: deleted
	})
})
ProjectsController.post("/:id/stacks", async (c) => {
	const { id } = c.req.param()
	if (!id || isNaN(parseInt(id))) {
		return c.json({ success: false, message: "Invalid project ID" }, 400)
	}
	const body = await c.req.json()
	const stack_ids = body.stack_ids as number[]
	if (
		stack_ids &&
		stack_ids.length > 0 &&
		stack_ids.some((id: number) => isNaN(id))
	) {
		return c.json({ success: false, message: "Invalid stack IDs" }, 400)
	}
	const db = buildDB(c)
	await db.insert(projectToStackTable).values(
		stack_ids.map((stack_id) => ({
			project_id: parseInt(id),
			stack_id: stack_id
		}))
	)
	await reloadCache(c)
	return c.json({
		success: true,
		message: "Project stacks updated successfully"
	})
})


ProjectsController.put("/", async (c) => {
	const db = buildDB(c)
	const [result] = await db
		.insert(projectsTable)
		.values({
			created_at: new Date(),
			title: "New Project",
			is_visible: false
		})
		.returning()
	return c.json({
		success: true,
		message: "Project created successfully",
		project: result
	})
})

ProjectsController.patch("/:id", async (c) => {
	const { id } = c.req.param()
	if (!id || isNaN(parseInt(id))) {
		return c.json({ success: false, message: "Invalid project ID" }, 400)
	}
	const body = await c.req.json()
	const project = {
		...body,
		id: undefined,
		created_at: undefined,
		project_end_date: body.project_end_date
			? new Date(body.project_end_date)
			: null,
		project_start_date: body.project_start_date
			? new Date(body.project_start_date)
			: null
	}
	const db = buildDB(c)
	const [upsert] = await db
		.update(projectsTable)
		.set({
			...project,
			created_at: new Date(),
			id: id
		})
		.where(eq(projectsTable.id, parseInt(id)))
		.returning()
	if (!upsert) {
		return c.json({ success: false, message: "Project not found" }, 404)
	}
	await reloadCache(c)
	return c.json({
		success: true,
		message: "Project updated successfully",
		project: upsert
	})
})
export default ProjectsController
