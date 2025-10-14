import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken"
import { prisma_db } from "../lib/prisma";

export async function verifyAccess(request: FastifyRequest, reply: FastifyReply) {
	
	const ACCESS_TOKEN_SECRET = process.env.ACCESS_SECRET;

	// como os tokens são variáveis .env, eles podem ser undefined ou strings, a função verify do jwt espera um tipo string, precisamos garantir que eles não são undefined para o typescript não dar erro.
	if (!ACCESS_TOKEN_SECRET) { 
		// reply.code(401).send({statusCode: 401, error: "Not Found", message: "accessToken or refreshToken secret is not defined in environment variables."})
		return reply.notFound("accessToken or refreshToken secret is not defined in environment variables.");
	}

	const token = request.cookies.accessToken;

	if (!token) {
		// reply.code(403).send({statusCode: 403, error: "Forbidden", message: "Invalid or expired token"})
		return reply.forbidden("Invalid or expired token");
	}

	let decoded;

	try {
		decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as { userId: string }; // decodifiga o token e diz que o token possui um campo 'userId'
	} catch {
		// reply.code(403).send({statusCode: 403, error: "Forbidden", message: "Invalid or expired token"})
		return reply.forbidden("Invalid or expired token");
	}

	const userExists = await prisma_db.user.findUnique({where: {id: decoded.userId}});

	if (!userExists) { // impede que usuários que já foram deletados mas possuem tokens ativos consigam ser autenticados
		// reply.code(403).send({statusCode: 403, error: "Forbidden", message: "Invalid or expired token"})
		return reply.forbidden("Invalid or expired token");
	};

	request.user = { id: decoded.userId }; // para para o campo user do request o userId que está dentro do token decodificado;
}