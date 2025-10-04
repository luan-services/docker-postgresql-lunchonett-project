import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const errorHandler = (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
  
    request.log.error(error); // sempre imprime o erro no console para teste

    // vemos o status code, se não existir coloca um erro genérico.
    let statusCode = error.statusCode || 500;

    // criamos um objeto de resposta genérico, com a mensagem do error, stack e com o título sendo server erro.
    let response = {
        title: 'Server Error',
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? 'forbidden' : error.stack, // se o ambiente for de produção, não envia a stack do erro por segurança
    };

    // erro de violação de constraint única do Prisma (como no mongoose) (ex: email duplicado)
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        statusCode = 409; // status code para conflict
        const field = (error.meta?.target as string[])?.join(', ');
        response.title = 'Duplicate Key Error';
        response.message = `Já existe um registro com este valor para o campo: ${field}.`;
    }
    
    // aqui pode se adicionar outros 'if' para tratar mais erros específicos

    // LER PASSO 4 DO TUTORIAL DO FASTIFY
    // esse if é como o switch/case do errorHandler do express, porém mais poderoso, aqui checamos se o error possui um nome (se o statusCode foi definido pelo @fastify/sensible), e mudamos o title da response.
    if (error.statusCode && statusCode < 500) {
        response.title = error.name; // Ex: "Not Found", "Bad Request"
    }

    // Envia a resposta final
    return reply.status(statusCode).send(response);
};