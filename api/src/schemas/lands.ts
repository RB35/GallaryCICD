import { createInsertSchema, createUpdateSchema, createSelectSchema } from "drizzle-orm/typebox";
import { landsTable } from "../db/schema.js";
import { Type } from "typebox";

export const PolygonSchema = Type.Object({
    type: Type.Literal("Polygon"),
    coordinates: Type.Array(
        Type.Array(
            Type.Tuple([Type.Number(), Type.Number()])
        )
    ),
});

export const landsInsertSchema = createInsertSchema(landsTable, {
    polygon: PolygonSchema
});

export const landsUpdateSchema = createUpdateSchema(landsTable);

export const landsReturnSchema = createSelectSchema(landsTable);