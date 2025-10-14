import "fastify";

declare module "fastify" {
	interface FastifyRequest { // inclui na interface FastifyRequest o campo userId (globalmente), para deixar claro a existência desse campo
	// isso é necessário para garantir que rotas que precisam de autenticação saibam que o validateAccessTokenHandler adicionar um campo user ao request.
		user?: { id: string }; 
	}
}
