import Fastify from 'fastify'; // importando o framework fastify

import { prisma_db } from './lib/prisma'; // importa a instância do prisma de utils

import sensible from '@fastify/sensible'; // biblioteca para enviar respostas com erros de forma simples
import { errorHandler } from './lib/errorHandler'; // importa a função errorHandler

import { configDotenv } from 'dotenv';

import { authRoutes } from './routes/authRoutes'; // importa as rotas de auth

import { validatorCompiler, serializerCompiler } from 'fastify-type-provider-zod' // plugin do fastify que valida os schemas do zod (é necessário pois o plugin nativo do fastify só valida json, precisa desse pro zod)

configDotenv();

// inicializa o fastify e coloca a instância em app
const app = Fastify({
  	logger: process.env.NODE_ENV !== 'production', // habilita o logger de debug, apenas em dev
})

app.register(sensible); // registra o sensible (mesmo que app.use)
app.setErrorHandler(errorHandler); // setErrorHandler é uma função nativa do fastify, que registra uma função error handler.

app.setValidatorCompiler(validatorCompiler); // aqui usamos o plugin type provider do zod
app.setSerializerCompiler(serializerCompiler); // aqui usamos o plugin type provider do zod

// registra um plugin (cria uma rota, com prefixo /auth que usa os routes de auth)
app.register(authRoutes, { prefix: 'api/auth' });

// cria a primeira rota de teste
app.get('/', async (request, reply) => {
	return { hello: 'world' };
});

// função para inicia o servidor
const start = async () => { // esse bloco usa try catch porque o errorHandler só lida com error de REQUISIÇÕES, ou seja, dos routes.
	try {
		// aqui, forçamos a conexão de imediato, para não ter que esperar algum usuário chamar alguma rota que use o prisma.
		await prisma_db.$connect(); 
		app.log.info('Conexão com o banco de dados estabelecida com sucesso.');
		await app.listen({ port: 3000 });
		// O logger do Fastify já informa a URL no console
	} catch (err) {
		app.log.error(err);
		process.exit(1);
	}
};

start();