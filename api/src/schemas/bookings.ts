import { createInsertSchema, createUpdateSchema, createSelectSchema } from "drizzle-orm/typebox";
import { bookingsTable } from "../db/schema.js";
import { Type } from "typebox";

export const bookingInsertSchema = Type.Omit(createInsertSchema(bookingsTable), ["createdDate"]);

export const bookingUpdateSchema = Type.Omit(createUpdateSchema(bookingsTable), ["createdDate"]);

export const bookingReturnSchema = createSelectSchema(bookingsTable);