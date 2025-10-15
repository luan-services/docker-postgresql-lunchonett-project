import { FastifyRequest, FastifyReply } from "fastify";
import { prisma_db } from "../lib/prisma";

//@desc Get logged user data
//@route GET /api/users/me
//@access private
export const meHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user?.id; // populate pelo verifyAccess

    if (!userId) {
		// reply.code(401).send({statusCode: 401, error: "Unauthorized", message: "User not authenticated"})
		return reply.unauthorized("User not authenticated");
    }

    const user = await prisma_db.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            role: true,
            email: true,
            address: true,
            phone: true,
            createdAt: true,
        },
    });

    if (!user) {
        // reply.code(404).send({statusCode: 404, error: "Not Found", message: "User not found"})
        return reply.notFound("User not found");
    } 

    return reply.code(200).send({ user });
};
