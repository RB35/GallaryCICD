import { authenticationRequestSchema, authenticationResultSchema } from '../../../schemas/auth.js';
import { Type } from 'typebox';
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import * as argon2 from "argon2";

const authRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
    //Authenticate a user
    fastify.post('/',
        {
            schema: {
                body: authenticationRequestSchema,
                response: { 200: authenticationResultSchema, 401: Type.Unknown() }
            }
        },
        async (request, reply) => {
            const { email, password } = request.body;

            //Get the user if it exits
            const user = await fastify.userRepo.getByEmail(email);

            //Return if user doesnt exist
            if (!user) {
                return reply.status(401).send();
            }

            //Compare password with hash
            const passwordValid = await argon2.verify(user.passwordHash, password);

            //Return if password is incorrect
            if (!passwordValid) {
                return reply.status(401).send();
            }

            //User is now authenticated at this point generate JWT

            const token = await reply.jwtSign({
                sub: user.id,
                role: user.role
            }, { expiresIn: "30d" });

            return reply.status(200).send({ token: token });
        });
}

export default authRoutes;