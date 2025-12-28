import type { FastifyInstance, FastifyPluginAsync } from 'fastify'
import { AuthService } from './auth.service'
import { loginHandler, requestOtpHandler } from './auth.controller'
import { loginSchema, requestOtpSchema } from './auth.schemas'
import { ADMIN_LOGIN } from './auth.constants'
import { sendError, sendOk } from '../../utils/apiResponse'

export const registerAuthRoutes: FastifyPluginAsync = async (fastify): Promise<void> => {
  if (!fastify.prisma) {
    fastify.post('/request-otp', { schema: requestOtpSchema }, async (request, reply) => {
      const login = (request.body as any)?.login

      if (typeof login === 'string' && login.trim() === ADMIN_LOGIN) {
        sendOk(reply, { needToUsePassword: true })
        return
      }

      sendError(reply, 503, 'DB_NOT_READY', request.t('errors.internal'))
    })

    fastify.post('/login', { schema: loginSchema }, async (request, reply) => {
      sendError(reply, 503, 'DB_NOT_READY', request.t('errors.internal'))
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
