import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import { userRole } from "../schemas/users.js";

declare module "fastify" {
    export interface FastifyContextConfig {
        requiresAuth?: boolean;
        roles?: userRole[];
    }
}



export default fp(
    async (fastify: FastifyInstance) => {

        //Handler which handles auth if required
        fastify.addHook('preHandler', async (request, reply) => {
            const config = request.routeOptions.config;

            if (!config?.requiresAuth) {
                return; //Continue auth not needed
            }

            //Verify jwt is valid
            await request.jwtVerify();

            //If roles are provided ensure the user has a valid role
            if (config?.roles && config.roles.length > 0) {
                const role = request.user.role;

                if (!config.roles.includes(role)) {
                    return reply.status(403).send({
                        message: "Forbidden"
                    });
                }

            }


        });
    },
    {
        name: "authorization"
    },
);
