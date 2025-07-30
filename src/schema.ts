import { relations } from "drizzle-orm"
import { int, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const projectsTable = sqliteTable("projects", {
	id: int().primaryKey({ autoIncrement: true }).notNull(),
	created_at: int({ mode: "timestamp_ms" }).defaultNow(),
	title: text().notNull(),
	description: text().notNull(),
	project_start_date: int({ mode: "timestamp_ms" }),
	project_end_date: int({ mode: "timestamp_ms" }),
	thumbnail_url: text()
})
export const projectToStackTable = sqliteTable(
	"project_to_stack",
	{
		project_id: int()
			.references(() => projectsTable.id)
			.notNull(),
		stack_id: int()
			.references(() => stackTable.id)
			.notNull()
	},
	(table) => [primaryKey({ columns: [table.project_id, table.stack_id] })]
)

export const stackTable = sqliteTable("stack", {
	id: int().primaryKey({ autoIncrement: true }).notNull(),
	key: text().notNull().unique(),
	description: text(),
	created_at: int({ mode: "timestamp_ms" }).defaultNow(),
	url: text(),
	type: text().$type<
		"library" | "framework" | "runtime" | "language" | "other" | "tool"
	>(),
	image_url: text()
})
