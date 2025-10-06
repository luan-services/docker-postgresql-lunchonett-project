import { FastifyInstance } from "fastify"; // type da instância 'app' do fastify, apenas para definir o tipo em typescript
import { FastifyReply } from "fastify/types/reply"; // type do Request do Fastify
import { FastifyRequest } from "fastify/types/request"; // type do Reply

import { userRegisterSchema, userLoginSchema } from "../schemas/authSchemas"; // importamos os schemas de validação do zod
import { UserRegisterInput, UserLoginInput } from "../schemas/authSchemas"; // importamos a tipagem do requests para não ter error no TypeScript


export const authRoutes = async (app: FastifyInstance) => {

    // route para registro
    app.post('/register', 
        { schema: {body: userRegisterSchema}},
        async (request:FastifyRequest<{Body: UserRegisterInput}>, reply:FastifyReply) => {
            reply.code(201).send({message: "reply dummy de registro"})
        }
    );

    app.post('/login', 
        { schema: {body: userLoginSchema}},
        async (request:FastifyRequest<{Body: UserLoginInput}>, reply:FastifyReply) => {
            reply.code(200).send({message: "reply dummy de login"})
        }
    );
}