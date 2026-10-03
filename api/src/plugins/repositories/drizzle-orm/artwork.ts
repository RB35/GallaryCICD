import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { artworkTable } from "../../../db/schema.js";
import { eq } from "drizzle-orm";

export const createArtworkRepository = (db: NodePgDatabase) => ({

    //Returns all artworks from the database
    async getAll() {
        return db.select().from(artworkTable);
    },

    //Get a single artwork given its id
    async getById(id: number) {
        const [result] = await db.select().from(artworkTable).where(eq(artworkTable.id, id));
        return result || null;
    },

    //Adds a new artwork to the database and returns the newly created artwork
    async add(data: typeof artworkTable.$inferInsert) {
        const [artwork] = await db.insert(artworkTable).values(data).returning();
        return artwork;
    },

    //Deletes an artwork with an id returning true if deleted or false if no row was deleted
    async deleteWithId(id: number) {
        const result = await db.delete(artworkTable).where(eq(artworkTable.id, id));

        return (result.rowCount ?? 0) > 0;
    },

    //Takes in artwork properties which will be used to update an artwork with a given id. The whole newly updated artwork is returned
    async updateWithId(id: number, data: Partial<typeof artworkTable.$inferInsert>) {
        const [updatedArtwork] = await db.update(artworkTable).set(data).where(eq(artworkTable.id, id)).returning()

        return updatedArtwork || null;
    }
});

export type ArtworkRepository = ReturnType<typeof createArtworkRepository>;
