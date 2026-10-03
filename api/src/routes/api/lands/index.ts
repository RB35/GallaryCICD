import { landsInsertSchema, landsReturnSchema, landsUpdateSchema } from '../../../schemas/lands.js';
import { Type } from 'typebox'
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';

const requestIdParameter = Type.Object({ id: Type.Integer({ minimum: 0 }) })

const landsRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  //Add a land
  fastify.post('/',
    {
      config: {
        requiresAuth: true,
        roles: ["admin", "curator"]
      },
      schema: {
        body: landsInsertSchema,
        response: {
          201: landsReturnSchema
        }
      }
    },
    async (request, reply) => {
      const newLand = await fastify.landRepo.add(request.body);
      return reply.status(201).send(newLand);
    });

  //Update the land with a given id
  fastify.patch('/:id',
    {
      config: {
        requiresAuth: true,
        roles: ["admin", "curator"]
      },
      schema: {
        params: requestIdParameter,
        body: landsUpdateSchema
      }
    },
    async (request, reply) => {
      const { id } = request.params;
      const updatedLand = await fastify.landRepo.updateWithId(id, request.body);

      if (!updatedLand) {
        return reply.status(404).send();
      }

      return reply.status(200).send(updatedLand);

    });

  //Get the land with a given id
  fastify.get('/:id',
    {
      config: {
        requiresAuth: true,
      },
      schema: {
        params: requestIdParameter,
      }
    },
    async (request, reply) => {
      const { id } = request.params;

      const land = await fastify.landRepo.getById(id);

      if (!land) {
        return reply.status(404).send();
      }

      return reply.status(200).send(land);
    });

  //Delete the land with a given id
  fastify.delete('/:id',
    {
      config: {
        requiresAuth: true,
        roles: ["admin", "curator"]
      },
      schema: {
        params: requestIdParameter,
      }
    },
    async (request, reply) => {
      const { id } = request.params;

      if (await fastify.landRepo.deleteWithId(id)) {
        return reply.status(204).send();
      } else {
        return reply.status(404).send();
      }
    });

  //Get all lands
  fastify.get('/',
    {
      config: {
        requiresAuth: true,
      },
      schema: {
        response: { 200: Type.Array(landsReturnSchema) }
      }
    },
    async (request, reply) => {
      const lands = await fastify.landRepo.getAll();
      return reply.status(200).send(lands);
    });

  //Get the lands which a point is within
  fastify.get('/search',
    {
      config: {
        requiresAuth: true,
      },
      schema: {
        querystring: Type.Object({ lon: Type.Number(), lat: Type.Number() }),
        response: { 200: Type.Array(landsReturnSchema) }
      }
    },
    async (request, reply) => {
      const { lon, lat } = request.query;
      const lands = await fastify.landRepo.findLandsAtPoint(lon, lat);
      return reply.status(200).send(lands);
    });

}

export default landsRoutes;