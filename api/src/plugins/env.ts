import fp from "fastify-plugin";
import env from "@fastify/env";

declare module "fastify" {
  interface FastifyInstance {
    config: {
      DATABASE_URL: string;
      DATABASE_MAX_CONNECTIONS: number;
      JWT_SECRET: string;
    };
  }
}

const schema = {
  type: "object",
  required: ["DATABASE_URL", "JWT_SECRET"],
  properties: {
    DATABASE_URL: {
      type: "string",
    },
    DATABASE_MAX_CONNECTIONS: {
      type: "number",
      default: 10,
    },
    JWT_SECRET: {
      type: "string"
    }
  },
};

export default fp(
  async (fastify) => {
    await fastify.register(env, {
      confKey: "config",
      schema,
      dotenv: true,
      data: process.env,
    });
  },
  {
    name: "env",
  },
);
