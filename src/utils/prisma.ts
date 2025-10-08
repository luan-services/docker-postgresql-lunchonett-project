
import { PrismaClient } from "../../generated/prisma";

// isso garante que só exista uma instância global (importante em dev com hot reload)
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/* inicializa uma instância do prismaClient(), usaremos essa instância para fazer os pedidos ao banco de dados, é como se fosse o mongoose
 
 diferente do mongoose, com o prisma, não é necessário se conectar ao banco de dados antes de rodar a aplicação, apenas iniciar o client,
 quando a primeira query for feita com o client, aí sim ele vai se conectar e manter aberto. 
 
 porém, isso é uma pratica ruim, pois queremos saber de imediato se o banco está OK ou não, para isso forçamos um conexão ao banco ANTES de iniciar o backend */
export const prisma_db = globalForPrisma.prisma || new PrismaClient({log: ['query', 'error', 'warn'],});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma_db;
