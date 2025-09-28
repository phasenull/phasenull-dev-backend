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
	const project = await db
		.select()
		.from(projectsTable)
		.where(eq(projectsTable.id, parseInt(id)))
		.limit(1)
	const relations = await db
		.select()
		.from(projectToStackTable)
		.where(eq(projectToStackTable.project_id, parseInt(id)))
	const project_stacks = await db
		.select()
		.from(stackTable)
		.where(
			inArray(
				stackTable.id,
				relations
					.filter((relation) => relation.project_id === parseInt(id))
					.map((relation) => relation.stack_id)
			)
		)
	if (!project) {
		return c.json({ success: false, message: "Project not found" }, 404)
	}
	return c.json({
		success: true,
		project,
		relations: relations.filter(
			(relation) => relation.project_id === parseInt(id)
		),
		stacks: project_stacks
	})
})
ProjectsController.get("/", async (c) => {
	const db = buildDB(c)
	const projects = await db
		.select()
		.from(projectsTable)
		.orderBy(desc(projectsTable.project_end_date))
	return c.json({ success: true, projects })
})
async function reloadCache(c: CustomContext) {
	const KV = c.env.KV as KVNamespace
	const db = buildDB(c)
	const stacks = await db.select().from(stackTable)
	const relations = await db.select().from(projectToStackTable)
	const projects = await db.select().from(projectToStackTable)
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
ProjectsController.delete("/:id", async (c) => {})

ProjectsController.post("/:id/stacks", async (c) => {
	const { id } = c.req.param()
	if (!id || isNaN(parseInt(id))) {
		return c.json({ success: false, message: "Invalid project ID" }, 400)
	}
	const body = await c.req.json()
	const db = buildDB(c)
	await db
		.delete(projectToStackTable)
		.where(eq(projectToStackTable.project_id, parseInt(id)))
	const stack_ids = body.stack_ids as number[]
	if (
		stack_ids &&
		stack_ids.length > 0 &&
		stack_ids.some((id: number) => isNaN(id))
	) {
		return c.json({ success: false, message: "Invalid stack IDs" }, 400)
	}
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
ProjectsController.post("/create", async (c) => {
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
	const db = buildDB(c)
	const [upsert] = await db
		.update(projectsTable)
		.set({
			...body,
			created_at: new Date(),
			id: undefined
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
