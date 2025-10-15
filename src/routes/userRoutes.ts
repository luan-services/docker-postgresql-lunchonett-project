import { FastifyInstance } from "fastify";
import { verifyAccess } from "../hooks_middlewares/validateAccessTokenHandler";
import { verifyCsrf } from "../hooks_middlewares/validateCsrfTokenHandler";

import { meHandler } from "../controllers/userControllers";

export const userRoutes = async (app: FastifyInstance) => {
    app.get('/me', 
        { preHandler: [verifyAccess, verifyCsrf] }, // hooks antes do controller (é como us middlewares)
        meHandler
    );
};
