import { FastifyInstance } from 'fastify'

export default async function (fastify: FastifyInstance) {
  fastify.get('/', () => {
    return "Welcome to the Aboriginal art gallery API!"
  })
}