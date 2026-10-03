import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { bookingInsertSchema, bookingReturnSchema, bookingUpdateSchema } from '../../../schemas/bookings.js';
import { Type } from "typebox";

const bookingRoutes: FastifyPluginAsyncTypebox = async (fastify) => {
  //Create a booking
  fastify.post('/',
    {
      config: {
        requiresAuth: true,
        roles: ["admin", "staff", "member"]

      },
      schema: {
        body: bookingInsertSchema,
        response: { 201: bookingReturnSchema, 403: Type.String() }
      }
    },
    async (request, reply) => {
      const booking = request.body;

      //Members can only create bookings for them self
      if (request.user.role == "member" && request.user.sub != booking.userId) {
        return reply.status(403).send("Not authorized to create a booking for the given user");
      }

      const newBooking = await fastify.bookingRepo.add(booking);
      return reply.status(201).send(newBooking);
    });

  //Update the booking with the given id
  fastify.patch('/:id',
    {
      config: {
        requiresAuth: true,
        roles: ["admin", "staff"]

      },
      schema: {
        params: Type.Object({ id: Type.Integer({ minimum: 0 }) }),
        body: bookingUpdateSchema,
        response: { 200: bookingReturnSchema, 404: Type.Unknown() }
      }
    },
    async (request, reply) => {
      const { id } = request.params;
      const updatedBooking = await fastify.bookingRepo.updateWithId(id, request.body);

      if (!updatedBooking) {
        return reply.status(404).send();
      }

      return reply.status(200).send(updatedBooking);
    });

  //Get the booking with the given id
  fastify.get('/:id',
    {
      config: {
        requiresAuth: true,

      },
      schema: {
        params: Type.Object({ id: Type.Integer({ minimum: 0 }) }),
        response: { 200: bookingReturnSchema, 404: Type.Unknown(), 403: Type.String() }
      }
    },
    async (request, reply) => {
      const { id } = request.params;

      const booking = await fastify.bookingRepo.getById(id);

      if (!booking) {
        return reply.status(404).send();
      }

      //Members can only access their own bookings
      if (request.user.role == "member" && request.user.sub != booking.userId) {
        return reply.status(403).send("Not authorized to access this booking");
      }

      return reply.status(200).send(booking);
    });

  //Delete the booking with the given id
  fastify.delete('/:id',
    {
      config: {
        requiresAuth: true,
        roles: ["admin", "staff"]

      },
      schema: {
        params: Type.Object({ id: Type.Integer({ minimum: 0 }) })
      }
    },
    async (request, reply) => {
      const { id } = request.params;

      if (await fastify.bookingRepo.deleteWithId(id)) {
        return reply.status(204).send();
      } else {
        return reply.status(404).send();
      }
    });

  //Get all bookings
  fastify.get('/',
    {
      config: {
        requiresAuth: true,
        roles: ["admin", "staff"]

      },
      schema: {
        response: { 200: Type.Array(bookingReturnSchema) }
      }
    },
    async (request, reply) => {
      const bookings = await fastify.bookingRepo.getAll();
      return reply.status(200).send(bookings);
    });

  //Get all future bookings
  fastify.get('/future',
    {
      config: {
        requiresAuth: true,
        roles: ["admin", "staff"]

      },
      schema: {
        response: { 200: Type.Array(bookingReturnSchema) }
      }
    },
    async (request, reply) => {
      //Get current date
      const date = new Date();

      const result = await fastify.bookingRepo.getOnOrAfter(date);

      return reply.status(200).send(result);
    });

  //Get all bookings for a certain day
  fastify.get('/day/:date',
    {
      config: {
        requiresAuth: true,
        roles: ["admin", "staff"]

      },
      schema: {
        params: Type.Object({
          date: Type.String({ format: 'date' })
        }),
        response: { 200: Type.Array(bookingReturnSchema) }
      }
    },
    async (request, reply) => {
      const { date } = request.params;

      //Convert param string to date
      const day = new Date(date);

      const result = await fastify.bookingRepo.getDay(day);

      return reply.status(200).send(result);
    });

  //Get all bookings for a certain user
  fastify.get('/user/:id',
    {
      config: {
        requiresAuth: true,
        roles: ["admin", "staff", "member"]
      },
      schema: {
        params: Type.Object({ id: Type.Integer({ minimum: 0 }) }),
        response: { 200: Type.Array(bookingReturnSchema), 403: Type.String() }
      }
    },
    async (request, reply) => {
      const { id } = request.params;

      if (request.user.role == "member" && request.user.sub != id) {
        return reply.status(403).send("Not authorized to access this users booking")
      }

      const result = await fastify.bookingRepo.getByUserId(id);

      return reply.status(200).send(result);
    });

}

export default bookingRoutes;