import { FastifyReply } from "fastify/types/reply"; // type do Request do Fastify
import { FastifyRequest } from "fastify/types/request"; // type do Reply
import { UserRegisterInput, UserLoginInput } from "../schemas/authSchemas"; // importamos a tipagem do requests do zod para não ter error no TypeScript

//@desc Register a user
//@route POST /api/auth/register
//@access public
export const userRegisterHandler = async (request:FastifyRequest<{Body: UserRegisterInput}>, reply:FastifyReply) => {
    reply.code(201).send({message: "reply dummy de registro"})
}

//@desc Login a user
//@route POST /api/auth/login
//@access public
export const userLoginHandler = async (request:FastifyRequest<{Body: UserLoginInput}>, reply:FastifyReply) => {
    reply.code(200).send({message: "reply dummy de login"})
}