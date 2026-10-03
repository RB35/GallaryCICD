import { integer, pgTable, pgEnum, varchar, boolean, timestamp, customType } from "drizzle-orm/pg-core";

//Custom type for PostGIS polygon
export const polygon = customType({
  dataType() {
    return "geometry(Polygon, 4326)";
  }
});

export const roleEnum = pgEnum("user_role", ["admin", "curator", "staff", "member"]);

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  firstName: varchar({ length: 255 }).notNull(),
  lastName: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  passwordHash: varchar({ length: 255 }).notNull(),
  role: roleEnum().notNull(),
  createdDate: timestamp().notNull().defaultNow()
});

export const artworkTable = pgTable("artwork", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  creator: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 1000 }).notNull(),
  media: varchar({ length: 255 }).notNull(),
  imageUrl: varchar({ length: 500 }),
  onDisplay: boolean().notNull().default(false),
  managedBy: integer().references(() => usersTable.id).notNull(),
  added: timestamp().notNull().defaultNow()
});

export const bookingsTable = pgTable("bookings", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().references(() => usersTable.id).notNull(),
  time: timestamp().notNull(),
  createdDate: timestamp().notNull().defaultNow(),
  notes: varchar({ length: 500 }).notNull()
});

export const landsTable = pgTable("lands", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 1000 }),
  polygon: polygon().notNull(),
  createdDate: timestamp().notNull().defaultNow()
});