import { FastifyInstance } from "fastify"; // type da instância 'app' do fastify, apenas para definir o tipo em typescript

import { userRegisterSchema, userLoginSchema } from "../schemas/authSchemas"; // importamos os schemas de validação do zod
import { userRegisterHandler, userLoginHandler, refreshTokenHandler, userLogoutHandler, userLogoutAllHandler } from "../controllers/authControllers"; // importa os controllers de auth

export const authRoutes = async (app: FastifyInstance) => {

    // route para registro /auth/register
    app.post('/register', 
        { schema: {body: userRegisterSchema}},
        userRegisterHandler
    );

    // route para login /auth/login
    app.post('/login', 
        { schema: {body: userLoginSchema}},
        userLoginHandler
    );

    // route para refresh /auth/refresh/
    app.post('/refresh', refreshTokenHandler);
    
    // route para logout /auth/logout/
    app.post('/logout', userLogoutHandler);
        
    // route para logout de todas as sessões /auth/logout_all/
    app.post('/logout_all', userLogoutHandler);
}