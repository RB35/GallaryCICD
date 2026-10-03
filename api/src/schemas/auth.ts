import { Type } from 'typebox'
import "@fastify/jwt"
import { userRole } from './users.js';

declare module "@fastify/jwt" {
    interface FastifyJWT {
        payload: {
            sub: number;
            role: userRole;
        };
        user: {
            sub: number;
            role: userRole;
        };
    }
}

export const authenticationRequestSchema = Type.Object({
    email: Type.String({ format: 'email' }),
    password: Type.String()
});

export const authenticationResultSchema = Type.Object({
    token: Type.String()
});