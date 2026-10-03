import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { usersTable } from "../../../db/schema.js";
import { eq } from "drizzle-orm";
import { DatabaseError } from 'pg';

type UserRole = typeof usersTable.$inferSelect.role;

//Error thrown when a conflict occurs
export class ConflictError extends Error { }

export const createUsersRepository = (db: NodePgDatabase) => ({

    //Returns all users from the database
    async getAll() {
        return db.select().from(usersTable);
    },

    //Returns all users with a given role
    async getAllWithRole(role: UserRole) {
        const result = await db.select().from(usersTable).where(eq(usersTable.role, role));
        return result;
    },

    //Returns the user with a given id of null if it doesn't exist
    async getById(id: number) {
        const [result] = await db.select().from(usersTable).where(eq(usersTable.id, id));
        return result || null;
    },

    //Returns a user with the given email adress
    async getByEmail(email: string) {
        const [result] = await db.select().from(usersTable).where(eq(usersTable.email, email));
        return result || null;
    },

    //Adds a new user to the data base and returns the newly created user
    async add(data: typeof usersTable.$inferInsert) {
        const [user] = await db.insert(usersTable).values(data).returning().onConflictDoNothing();
        return user || null; //If there is a conflict null will be returned
    },

    //"Patches" a user with a given id with new data.
    async updateWithId(id: number, data: Partial<typeof usersTable.$inferInsert>) {
        try {
            const [updatedUser] = await db
                .update(usersTable)
                .set(data)
                .where(eq(usersTable.id, id))
                .returning();

            return updatedUser || null;
        } catch (err) {
            if (err instanceof DatabaseError && err.code === '23505') { //23505 = unique_violation (this doesn't seem to be a great may to do this but I can't figure out a better way in drizzle)
                throw ConflictError;
            }
            throw err; //Allow other errors to continue on
        }
    },

    //Deletes an artwork with an id returning true if deleted or false if no row was deleted
    async deleteWithId(id: number) {
        const result = await db.delete(usersTable).where(eq(usersTable.id, id));
        return (result.rowCount ?? 0) > 0;
    },



});

export type UsersRepository = ReturnType<typeof createUsersRepository>;
