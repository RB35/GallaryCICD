import autoLoad from "@fastify/autoload";
import { join } from "node:path";
import fastify from "fastify";

import envPlugin from "./plugins/env.js";
import repositoryPlugin from "./plugins/repositories/drizzle-orm/index.js";
import fastifyJwt from "@fastify/jwt";
import authPlugin from "./plugins/auth.js";

const server = fastify();

//Plugins
await server.register(envPlugin); //Enviroment varibles with validation
await server.register(repositoryPlugin); //Adds access to the imported repository
await server.register(fastifyJwt, {
  secret: server.config.JWT_SECRET
})
await server.register(authPlugin);

//Autoload all route plugins from the routes folder
server.register(autoLoad, {
  dir: join(import.meta.dirname, "routes"),
});

server.listen({ port: 8000, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
