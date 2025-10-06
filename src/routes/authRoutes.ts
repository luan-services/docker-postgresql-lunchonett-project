import { FastifyInstance } from "fastify"; // type da instância 'app' do fastify, apenas para definir o tipo em typescript
import { FastifyReply } from "fastify/types/reply"; // type do Request do Fastify
import { FastifyRequest } from "fastify/types/request"; // type do Reply

export const authRoutes = async (app: FastifyInstance) => {

    // route para registro
    app.post('/register', async (request:FastifyRequest, reply:FastifyReply) => {
        reply.code(201).send({message: "reply dummy de registro"})
    });

    app.post('/login', async (request:FastifyRequest, reply:FastifyReply) => {
        reply.code(200).send({message: "reply dummy de login"})
    });
}