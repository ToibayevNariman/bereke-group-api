import type { FastifyPluginAsync } from 'fastify'
import { registerAuthRoutes } from '../../../modules/auth/auth.routes'

const authRoutePlugin: FastifyPluginAsync = async (fastify): Promise<void> => {
  await registerAuthRoutes(fastify, {})
}

export default authRoutePlugin
