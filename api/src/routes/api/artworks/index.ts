import { artworkInsertSchema, artworkUpdateSchema, artworkReturnSchema } from '../../../schemas/artworks.js';
import { Type } from 'typebox'
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';


const requestParameters = Type.Object({ id: Type.Integer({ minimum: 0 }) })

const artworkRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
    //Create an artwork
    fastify.post('/',
        {
            config: {
                requiresAuth: true,
                roles: ["admin", "curator"]
            },
            schema: {
                body: artworkInsertSchema,
                response: {
                    201: artworkReturnSchema
                }
            }
        },
        async (request, reply) => {
            const newArtwork = await fastify.artworkRepo.add(request.body);
            return reply.status(201).send(newArtwork);
        });

    //Update an artwork with a given id
    fastify.patch('/:id',
        {
            config: {
                requiresAuth: true,
                roles: ["admin", "curator"]
            },
            schema: {
                params: requestParameters,
                body: artworkUpdateSchema
            }
        },
        async (request, reply) => {
            const { id } = request.params;
            const updatedArtwork = await fastify.artworkRepo.updateWithId(id, request.body);

            if (!updatedArtwork) {
                return reply.status(404).send();
            }

            return reply.status(200).send(updatedArtwork);

        });

    //Get an artwork with a given id
    fastify.get('/:id',
        {
            config: {
                requiresAuth: true,
            },
            schema: {
                params: requestParameters,
            }
        },
        async (request, reply) => {
            const { id } = request.params;

            const artwork = await fastify.artworkRepo.getById(id);

            if (!artwork) {
                return reply.status(404).send();
            }

            return reply.status(200).send(artwork);
        });

    //Delete an artwork with a given id
    fastify.delete('/:id',
        {
            config: {
                requiresAuth: true,
                roles: ["curator", "admin"]
            },
            schema: {
                params: requestParameters,
            }
        },
        async (request, reply) => {
            const { id } = request.params;

            if (await fastify.artworkRepo.deleteWithId(id)) {
                return reply.status(204).send();
            } else {
                return reply.status(404).send();
            }
        });

    //Get all artworks
    fastify.get('/',
        {
            config: {
                requiresAuth: true,
            },
            schema: {
                response: { 200: Type.Array(artworkReturnSchema) }
            }
        },
        async (request, reply) => {
            const artworks = await fastify.artworkRepo.getAll();
            return reply.status(200).send(artworks);
        });
}

export default artworkRoutes;