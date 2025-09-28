import { Hono } from "hono"
import { CustomContext } from "../env"
import { buildDB } from "../utils"
import { projectToStackTable, stackTable } from "../schema"
import { asc, desc, eq, inArray } from "drizzle-orm"
import { RowData } from "../data-table.types"

const StacksController = new Hono<CustomContext>()
StacksController.get("/:id", async (c) => {
	const { id } = c.req.param()
	if (!id || isNaN(parseInt(id))) {
		return c.json({ success: false, message: "Invalid stack ID" }, 400)
	}
	const db = buildDB(c)
	const stack = await db
		.select()
		.from(stackTable)
		.where(eq(stackTable.id, parseInt(id)))
		.limit(1)
	const relations = await db
		.select()
		.from(projectToStackTable)
		.where(eq(projectToStackTable.stack_id, parseInt(id)))
	if (!stack) {
		return c.json({ success: false, message: "Stack not found" }, 404)
	}
	return c.json({ success: true, stack, relations })
})
StacksController.get("/", async (c) => {
	const db = buildDB(c)
	const stacks = await db.select().from(stackTable).orderBy(asc(stackTable.id))
	return c.json({ success: true, stacks })
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
			data: { success: true, stacks: stacks, relations: relations, projects: projects },
			created_at: new Date().toISOString()
		})
	)
	return { stacks, relations, projects }
}
StacksController.delete("/", async (c) => {
	const body = await c.req.json()
	const ids = body.ids as number[]
	if (!ids || ids.length === 0 || ids.some((id: number) => isNaN(id))) {
		return c.json({ success: false, message: "Invalid stack IDs" }, 400)
	}
	const db = buildDB(c)
	await db.delete(stackTable).where(inArray(stackTable.id, ids))
	await reloadCache(c)
	return c.json({ success: true, message: "Stacks deleted successfully" })
})

StacksController.patch("/", async (c) => {
	const body = await c.req.json()
	const rows = body.rows as RowData[]
	if (!rows || rows.length === 0) {
		return c.json({ success: false, message: "No rows provided" }, 400)
	}
	const db = buildDB(c)
	const results = []
	for (const row of rows) {
		const id = parseInt(row.id as string)
		if (isNaN(id)) continue
		const { id: _, _isModified, _isNew, _isSelected, created_at,...data } = row
		const result = await db
			.update(stackTable)
			.set({ ...data } as any)
			.where(eq(stackTable.id, id)).returning()
		results.push(result)
	}
	await reloadCache(c)
	return c.json({ success: true, message: "Stacks updated successfully",result:results })
})
StacksController.put("/", async (c) => {
	const body = await c.req.json()
	const rows = body.rows as RowData[]
	if (!rows || rows.length === 0) {
		return c.json({ success: false, message: "No rows provided" }, 400)
	}
	const db = buildDB(c)
	const results = await db.insert(stackTable).values(
		rows.map((row) => {
			const { id, _isNew, _isModified, _isSelected, created_at, ...data } = row
			if (!_isNew) throw new Error("All rows must be new for insertion")
			return { ...data as any,created_at: new Date() }
		})
	).onConflictDoNothing().returning()
	await reloadCache(c)
	return c.json({ success: true, message: "Stacks created successfully", data: results })
})

export default StacksController
