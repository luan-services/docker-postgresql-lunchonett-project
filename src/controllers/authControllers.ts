import { FastifyReply } from "fastify/types/reply"; // type do Request do Fastify
import { FastifyRequest } from "fastify/types/request"; // type do Reply
import { UserRegisterInput, UserLoginInput } from "../schemas/authSchemas"; // importamos a tipagem do requests do zod para não ter error no TypeScript

import { prisma_db } from "../utils/prisma";
import bcrypt from "bcrypt"; // library de hashing de senhas

//@desc Register a user
//@route POST /api/auth/register
//@access public
export const userRegisterHandler = async (request:FastifyRequest<{Body: UserRegisterInput}>, reply:FastifyReply) => {
    const { name, email, password, address, phone} = request.body

    const userExists = await prisma_db.user.findUnique({where: {email: email}});

    if (userExists) {
        // reply.code(400).send({statusCode: 409, error: "Bad Request", message: "User with this email already exists"})
        return reply.badRequest("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma_db.user.create({
        data: {
            name: name,
            email: email,
            password: hashedPassword,
            address: address,
            phone: phone,
        }
    })

    return reply.code(201).send({
        message: `User ${name} created successfully, id: ${process.env.NODE_ENV !== "production" ? newUser.id : "forbidden"}`
    });
}

//@desc Login a user
//@route POST /api/auth/login
//@access public
export const userLoginHandler = async (request:FastifyRequest<{Body: UserLoginInput}>, reply:FastifyReply) => {
    reply.code(200).send({message: "reply dummy de login"})
}