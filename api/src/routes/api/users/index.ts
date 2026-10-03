import { userReturnSchema, userUpdateRequestSchema, userRegisterSchema, userUpdateType } from '../../../schemas/users.js';
import { Type } from 'typebox'
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { ConflictError } from '../../../plugins/repositories/drizzle-orm/users.js';
import * as argon2 from "argon2";

const requestParameters = Type.Object({ id: Type.Integer({ minimum: 0 }) })

const userRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
    //Create a new user
    fastify.post('/',
        {
            config: {
                requiresAuth: true,
            },
            schema: {
                body: userRegisterSchema,
                response: { 201: userReturnSchema, 403: Type.Unknown() }
            }
        },
        async (request, reply) => {
            const { password, ...userData } = request.body;

            const passwordHash = await argon2.hash(password);

            //Only admins can create users with a role other than member
            if (request.user.role != "admin" && userData.role != "member") {
                return reply.status(403).send();
            }

            const user = await fastify.userRepo.add({ ...userData, passwordHash });
            return reply.status(201).send(user);
        });

    //Update a user
    fastify.patch('/:id',
        {
            config: {
                requiresAuth: true,
            },
            schema: {
                params: requestParameters,
                body: userUpdateRequestSchema,
                response: { 200: userReturnSchema, 404: Type.Unknown(), 409: Type.Unknown(), 403: Type.Unknown() }
            }
        },
        async (request, reply) => {
            try {
                const { id } = request.params;

                const { password, ...updates } = request.body; //Take password from updates and store everything else in updates

                const updateData: userUpdateType = { ...updates };

                //If password feild was provided hash it and add it to the updateData to be sent to the db
                if (password) {
                    updateData.passwordHash = await argon2.hash(password);
                }

                //Only admins can modify role
                if (updateData.role && request.user.role != "admin") {
                    return reply.status(403).send();
                }

                //Get user to be used for authorization checks
                const user = await fastify.userRepo.getById(id);

                //Staff can only update members
                if (request.user.role == "staff" && user.role != "member") {
                    return reply.status(403).send();
                }

                //Curators cannot do updates (they don't need to update members and staff/curator updates are done by admins)
                if (request.user.role == "curator") {
                    return reply.status(403).send();
                }

                //Members can only update themselves
                if (request.user.role == "member" && request.user.sub != user.id) {
                    return reply.status(403).send();
                }

                const result = await fastify.userRepo.updateWithId(id, updateData);

                //Null result means no user with the given id exists
                if (!result) {
                    return reply.status(404).send();
                }

                return reply.status(200).send(result);

            } catch (error) {
                if (error instanceof ConflictError) {
                    return reply.status(409).send();
                }
                throw error;
            }

        });

    //Get a user given their id
    fastify.get('/:id',
        {
            config: {
                requiresAuth: true,
            },
            schema: {
                params: requestParameters,
                response: { 200: userReturnSchema, 404: Type.Unknown(), 403: Type.Unknown() }
            }
        },
        async (request, reply) => {
            const { id } = request.params;

            const user = await fastify.userRepo.getById(id);

            //Members cannot get anyone but them self
            if (request.user.role == "member" && request.user.sub != user.id) {
                return reply.status(403).send();
            }

            //Staff can only get members
            if (request.user.role == "staff" && user.role != "member") {
                return reply.status(403).send();
            }


            if (!user) {
                return reply.status(404).send();
            }

            return reply.status(200).send(user);

        });

    //Deletes a user with a given id
    fastify.delete('/:id',
        {
            config: {
                requiresAuth: true,
                roles: ["admin"]
            },
            schema: {
                params: requestParameters,
            }
        },
        async (request, reply) => {
            const { id } = request.params;

            if (await fastify.userRepo.deleteWithId(id)) {
                return reply.status(204).send();
            } else {
                return reply.status(404).send();
            }
        });

    //Get all users
    fastify.get('/',
        {
            config: {
                requiresAuth: true,
                roles: ["admin"]
            },
            schema: {
                response: { 200: Type.Array(userReturnSchema) }
            }
        },
        async (request, reply) => {
            const users = await fastify.userRepo.getAll();
            return reply.status(200).send(users);
        });

    //Get all users with customer role
    fastify.get('/members',
        {
            config: {
                requiresAuth: true,
                roles: ["admin", "staff"]
            },
            schema: {
                response: { 200: Type.Array(userReturnSchema) }
            }
        },
        async (request, reply) => {
            const users = await fastify.userRepo.getAllWithRole("member");
            return reply.status(200).send(users);
        });

    //Get all users with curator role
    fastify.get('/curators',
        {
            config: {
                requiresAuth: true,
                roles: ["admin", "curator"]
            },
            schema: {
                response: { 200: Type.Array(userReturnSchema) }
            }
        },
        async (request, reply) => {
            const users = await fastify.userRepo.getAllWithRole("curator");
            return reply.status(200).send(users);
        });

    //Get all users with curator role
    fastify.get('/staff',
        {
            config: {
                requiresAuth: true,
                roles: ["admin", "staff"]
            },
            schema: {
                response: { 200: Type.Array(userReturnSchema) }
            }
        },
        async (request, reply) => {
            const users = await fastify.userRepo.getAllWithRole("staff");
            return reply.status(200).send(users);
        });

    //Get all users with admin role
    fastify.get('/admins',
        {
            config: {
                requiresAuth: true,
                roles: ["admin"]
            },
            schema: {
                response: { 200: Type.Array(userReturnSchema) }
            }
        },
        async (request, reply) => {
            const users = await fastify.userRepo.getAllWithRole("admin");
            return reply.status(200).send(users);
        });
}

export default userRoutes;