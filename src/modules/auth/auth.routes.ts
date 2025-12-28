import type { FastifyInstance, FastifyPluginAsync } from 'fastify'
import { AuthService } from './auth.service'
import { loginHandler, requestOtpHandler } from './auth.controller'
import { loginSchema, requestOtpSchema } from './auth.schemas'

export const registerAuthRoutes: FastifyPluginAsync = async (fastify): Promise<void> => {
  if (!fastify.prisma) {
    fastify.post('/request-otp', { schema: requestOtpSchema }, async (request, reply) => {
      reply.code(503).type('application/json').send({
        successful: false,
        data: null,
        error: { code: 'DB_NOT_READY', message: request.t('errors.internal') }
      })
    })

    fastify.post('/login', { schema: loginSchema }, async (request, reply) => {
      reply.code(503).type('application/json').send({
        successful: false,
        data: null,
        error: { code: 'DB_NOT_READY', message: request.t('errors.internal') }
      })
    })

    return
  }

  const auth = new AuthService(fastify.prisma, fastify.log)

  fastify.post('/request-otp', { schema: requestOtpSchema }, requestOtpHandler(auth))
  fastify.post('/login', { schema: loginSchema }, loginHandler(auth))
}

export async function authRoutes(fastify: FastifyInstance): Promise<void> {
  await registerAuthRoutes(fastify, {})
}
