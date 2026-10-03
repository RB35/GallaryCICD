import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { bookingsTable } from "../../../db/schema.js";
import { eq, gte, lt, and } from "drizzle-orm";

//In this repo we need to make use of some raw SQL as drizzle doesn't support postgis very well

export const createBookingRepository = (db: NodePgDatabase) => ({

    //Returns all lands from database
    async getAll() {
        return db.select().from(bookingsTable)
    },

    async add(data: typeof bookingsTable.$inferInsert) {
        const [booking] = await db.insert(bookingsTable).values(data).returning();
        return booking;
    },

    async deleteWithId(id: number) {
        const result = await db.delete(bookingsTable).where(eq(bookingsTable.id, id));

        return (result.rowCount ?? 0) > 0;
    },

    async updateWithId(id: number, data: Partial<typeof bookingsTable.$inferInsert>) {
        const [updatedBooking] = await db.update(bookingsTable).set(data).where(eq(bookingsTable.id, id)).returning()

        return updatedBooking || null;
    },

    async getById(id: number) {
        const [result] = await db.select().from(bookingsTable).where(eq(bookingsTable.id, id));
        return result || null;
    },

    async getByUserId(userId: number) {
        const result = await db.select().from(bookingsTable).where(eq(bookingsTable.userId, userId));
        return result;
    },

    //Returns all bookings for a given day
    async getDay(day: Date) {
        const nextDay = new Date(day);
        nextDay.setDate(nextDay.getDate() + 1);
        const result = await db.select().from(bookingsTable).where(and(gte(bookingsTable.time, day), lt(bookingsTable.time, nextDay)));
        return result;
    },

    async getOnOrAfter(time: Date) {
        const result = await db.select().from(bookingsTable).where(gte(bookingsTable.time, time));
        return result;
    }



});

export type BookingRepository = ReturnType<typeof createBookingRepository>;
