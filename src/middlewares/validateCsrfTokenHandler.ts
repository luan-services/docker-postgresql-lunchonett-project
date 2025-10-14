import { FastifyRequest, FastifyReply } from "fastify";

export async function verifyCsrf(req: FastifyRequest, reply: FastifyReply) {

	const cookieToken = req.cookies.csrfToken; // pega o token enviado como cookie pelo front

	const headerToken = req.headers["x-csrf-token"]; // pega o token enviado como header pelo front (deve ser o mesmo que está no cookie, o front envia como header para previnir ataques CSRF)

	if (!cookieToken || !headerToken || cookieToken !== headerToken) {
		// reply.code(403).send({statusCode: 403, error: "Forbidden", message: "Invalid or expired CSRF token"})
		return reply.forbidden("Invalid or expired CSRF token");
	}
}
