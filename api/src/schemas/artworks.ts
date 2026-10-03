import { createInsertSchema, createUpdateSchema, createSelectSchema } from "drizzle-orm/typebox";
import { artworkTable } from "../db/schema.js";

//Generate the artwork insert schema using the database schema
export const artworkInsertSchema = createInsertSchema(artworkTable);

//Generate the artwork update schema using the database schema
export const artworkUpdateSchema = createUpdateSchema(artworkTable);

//Generate the return schema using the database schema
export const artworkReturnSchema = createSelectSchema(artworkTable);