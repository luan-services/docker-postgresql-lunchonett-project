import { FastifyReply } from "fastify/types/reply"; // type do Request do Fastify
import { FastifyRequest } from "fastify/types/request"; // type do Reply
import { UserRegisterInput, UserLoginInput } from "../schemas/authSchemas"; // importamos a tipagem do requests do zod para não ter error no TypeScript

import { prisma_db } from "../lib/prisma";

import bcrypt from "bcrypt"; // library de hashing de senhas
import jwt from "jsonwebtoken" // library para gerar tokens
import { randomUUID } from "crypto"; // função pra gerar senha pro csrf token 

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
    
    const { email, password } = request.body;
	const ACCESS_TOKEN_SECRET = process.env.ACCESS_SECRET;
    const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

	// como os tokens são variáveis .env, eles podem ser undefined ou strings, a função verify do jwt espera um tipo string, precisamos garantir que eles não são undefined para o typescript não dar erro.
	if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) { 
		// reply.code(401).send({statusCode: 401, error: "Not Found", message: "accessToken or refreshToken secret is not defined in environment variables."})
		return reply.notFound("accessToken or refreshToken secret is not defined in environment variables.");
	}

    const userExists = await prisma_db.user.findUnique({ where: { email: email} });

    if (!userExists) {
        // reply.code(401).send({statusCode: 401, error: "Unauthorized", message: "Invalid credentials"})
        return reply.unauthorized("Invalid credentials");
    };

    const passwordMatch = await bcrypt.compare(password, userExists.password);

    if (!passwordMatch) {
        // reply.code(401).send({statusCode: 401, error: "Unauthorized", message: "Invalid credentials"})
        return reply.unauthorized("Invalid credentials");
    }

    // gera tokens
    const accessToken = jwt.sign({userId: userExists.id}, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({userId: userExists.id}, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
    const csrfToken = randomUUID();

    await prisma_db.session.create({ // cria uma sessão e guarda o hash do refresh no banco
        data: {
            userId: userExists.id,
            refreshHash: await bcrypt.hash(refreshToken, 10), // coloca um hash do refreshToken na sessão, para remover apenas a sessão ao fazer logout
            userAgent: request.headers["user-agent"],
            ip: request.ip,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
    });

    reply.setCookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 15,
    })
      
    reply.setCookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    })
    
    reply.setCookie("csrfToken", csrfToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    })

    return reply.code(200).send({message: `User ${email} logged in successfully`});

}