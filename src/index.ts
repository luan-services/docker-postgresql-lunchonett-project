import Fastify from 'fastify'; // importando o framework fastify
import { PrismaClient } from "../generated/prisma"; // importa o prismaClient gerado para mexer no bano

import sensible from '@fastify/sensible'; // biblioteca para enviar respostas com erros de forma simples
import { errorHandler } from './middlewares/errorHandler';

// inicializa o fastify e coloca a instância em app
const app = Fastify({
  	logger: process.env.NODE_ENV !== 'production', // habilita o logger de debug, apenas em dev
});

/* inicializa uma instância do prismaClient(), usaremos essa instância para fazer os pedidos ao banco de dados, é como se fosse o mongoose
 diferente do mongoose, com o prisma, não é necessário se conectar ao banco de dados antes de rodar a aplicação, apenas iniciar o client,
 quando a primeira query for feita com o client, aí sim ele vai se conectar e manter aberto. porém, isso é uma pratica ruim, pois queremos
 saber de imediato se o banco está OK ou não, para isso forçamos um conexão ao banco ANTES de iniciar o backend */
const prisma_db = new PrismaClient();

app.register(sensible); // registra o sensible (mesmo que app.use)

app.setErrorHandler(errorHandler); // setErrorHandler é uma função nativa do fastify, que registra um error handler.

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