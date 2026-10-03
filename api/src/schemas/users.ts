import { createInsertSchema, createUpdateSchema, createSelectSchema } from "drizzle-orm/typebox";
import { usersTable } from "../db/schema.js";
import { Type, Static } from 'typebox'

const userInsertBase = createInsertSchema(usersTable, {
    email: Type.String({ format: 'email' }) //Enforces that the email property must be in the format of an email
});
const userUpdateBase = createUpdateSchema(usersTable, {
    email: Type.Optional(Type.String({ format: 'email' }))
});
const userSelectBase = createSelectSchema(usersTable, {
    email: Type.String({ format: 'email' })
});

//Type used within backend when building update data to send to database
export type userUpdateType = Static<typeof userUpdateBase>;

//Omit passwordHash from the database schema as it should never be accepted or returned to the user
//The password hash should only be used within the backend for authentication
export const userReturnSchema = Type.Omit(userSelectBase, ["passwordHash"]);

//Dervive a registaion schema from the insert by adding a password property
export const userRegisterSchema = Type.Intersect([
    Type.Omit(userInsertBase, ["passwordHash", "createdDate"]),
    Type.Object({
        password: Type.String({ minLength: 8 })
    })
]);

export const userUpdateRequestSchema = Type.Intersect([
    Type.Omit(userUpdateBase, ["passwordHash", "createdDate"]),
    Type.Object({
        password: Type.Optional(Type.String({ minLength: 8 }))
    })
]);

export type userRole = Static<typeof userSelectBase.properties.role>