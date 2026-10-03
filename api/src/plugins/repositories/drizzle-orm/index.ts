import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from "pg";


//Import repo to be added
import { createArtworkRepository, ArtworkRepository } from "./artwork.js";
import { createUsersRepository, UsersRepository } from "./users.js";
import { createLandsRepository, LandsRepository } from "./lands.js";
import { createBookingRepository, BookingRepository } from "./bookings.js";

declare module "fastify" {
    export interface FastifyInstance {
        artworkRepo: ArtworkRepository;
        userRepo: UsersRepository;
        landRepo: LandsRepository;
        bookingRepo: BookingRepository;
    }
}

export default fp(
    async (fastify: FastifyInstance) => {
        console.log(fastify.config.DATABASE_URL)
        //Create pg connection
        const pool = new pg.Pool({
            connectionString: fastify.config.DATABASE_URL,
            max: fastify.config.DATABASE_MAX_CONNECTIONS,
        });

        //Start drizzle
        const db = drizzle({ client: pool });

        await migrate(db, {
            migrationsFolder: "./drizzle",
        });

        //Create the repos using the created drizzle object and inject them into fastify
        fastify.decorate("artworkRepo", createArtworkRepository(db));
        fastify.decorate("userRepo", createUsersRepository(db));
        fastify.decorate("landRepo", createLandsRepository(db));
        fastify.decorate("bookingRepo", createBookingRepository(db));

        //Add Hook to close the pg connection on close
        fastify.addHook("onClose", async () => {
            await pool.end();
        });
    },
    {
        name: "drizzle",
        dependencies: ["env"],
    },
);
