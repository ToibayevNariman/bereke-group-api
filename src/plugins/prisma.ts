import fp from 'fastify-plugin'
import { PrismaClient } from '@prisma/client'

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

  const prisma = new PrismaClient()
  fastify.decorate('prisma', prisma)

  fastify.addHook('onClose', async (instance) => {
    await instance.prisma?.$disconnect()
  })
})
