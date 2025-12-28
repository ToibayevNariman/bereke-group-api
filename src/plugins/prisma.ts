import fp from 'fastify-plugin'
import { PrismaClient } from '@prisma/client'
import { getPrismaClient } from '../common/prisma'

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient | null
  }
}

export default fp(async (fastify) => {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    fastify.log.warn('DATABASE_URL is not set; Prisma plugin is disabled')
    fastify.decorate('prisma', null)
    return
  }

  const prisma = getPrismaClient()
  fastify.decorate('prisma', prisma)

  fastify.addHook('onClose', async (instance) => {
    try {
      await instance.prisma?.$disconnect()
    } catch (err) {
      instance.log.warn({ err }, 'Failed to disconnect Prisma cleanly')
    }
  })
})
