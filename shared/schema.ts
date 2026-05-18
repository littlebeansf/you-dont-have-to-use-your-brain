import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// No persistent DB needed — all content is static JSON
// We keep progress tracking client-side via React state
export const placeholder = sqliteTable("placeholder", {
  id: integer("id").primaryKey(),
});

export type Placeholder = typeof placeholder.$inferSelect;
export const insertPlaceholderSchema = createInsertSchema(placeholder);
export type InsertPlaceholder = z.infer<typeof insertPlaceholderSchema>;
