import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { landsTable } from "../../../db/schema.js";
import { eq, sql } from "drizzle-orm";
import { landsUpdateSchema } from "../../../schemas/lands.js";
import { Static } from "typebox";

//In this repo we need to make use of some raw SQL as drizzle doesn't support postgis very well

export const createLandsRepository = (db: NodePgDatabase) => ({

    //Returns all lands from database
    async getAll() {
        return db
            .select({
                id: landsTable.id,
                name: landsTable.name,
                description: landsTable.description,
                createdDate: landsTable.createdDate,
                polygon: sql`ST_AsGeoJSON(${landsTable.polygon})::json`.as("polygon"),
            })
            .from(landsTable);
    },

    //Add a land to the database
    async add(data: typeof landsTable.$inferInsert) {
        const [land] = await db
            .insert(landsTable)
            .values({
                ...data,
                polygon: sql`ST_GeomFromGeoJSON(${JSON.stringify(data.polygon)})`,
            })
            .returning({
                id: landsTable.id,
                name: landsTable.name,
                description: landsTable.description,
                createdDate: landsTable.createdDate,
                polygon: sql`ST_AsGeoJSON(${landsTable.polygon})::json`.as("polygon"),
            });

        return land;
    },

    async findLandsAtPoint(lon: number, lat: number) {
        return db
            .select({
                id: landsTable.id,
                name: landsTable.name,
                description: landsTable.description,
                createdDate: landsTable.createdDate,
                polygon: sql`ST_AsGeoJSON(${landsTable.polygon})::json`.as("polygon"),
            })
            .from(landsTable)
            .where(
                sql`ST_Covers(${landsTable.polygon},ST_SetSRID(ST_MakePoint(${lon}, ${lat}), 4326))`
            );
    },

    async deleteWithId(id: number) {
        const result = await db.delete(landsTable).where(eq(landsTable.id, id));
        return (result.rowCount ?? 0) > 0;
    },

    async getById(id: number) {
        const [result] = await db.select({
            id: landsTable.id,
            name: landsTable.name,
            description: landsTable.description,
            createdDate: landsTable.createdDate,
            polygon: sql`ST_AsGeoJSON(${landsTable.polygon})::json`.as("polygon"),
        }).from(landsTable).where(eq(landsTable.id, id));

        return result || null;
    },

    async updateWithId(id: number, data: Static<typeof landsUpdateSchema>) {
        const { polygon, ...rest } = data;

        const [updated] = await db
            .update(landsTable)
            .set({
                ...rest,
                ...(polygon && {
                    polygon: sql`ST_GeomFromGeoJSON(${JSON.stringify(polygon)})`,
                }),
            })
            .where(eq(landsTable.id, id))
            .returning({
                id: landsTable.id,
                name: landsTable.name,
                description: landsTable.description,
                createdDate: landsTable.createdDate,
                polygon: sql`ST_AsGeoJSON(${landsTable.polygon})::json`.as("polygon"),
            });

        return updated;
    }


});

export type LandsRepository = ReturnType<typeof createLandsRepository>;
