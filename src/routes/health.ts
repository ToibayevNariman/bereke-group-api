import type { FastifyPluginAsync } from 'fastify'
import { sendError, sendOk } from '../utils/apiResponse'

function isoNow(): string {
  return new Date().toISOString()
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return await new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('TIMEOUT'))
    }, timeoutMs)

    promise
      .then((value) => {
        clearTimeout(timer)
        resolve(value)
      })
      .catch((err) => {
        clearTimeout(timer)
        reject(err)
      })
  })
}

const healthRoutes: FastifyPluginAsync = async (fastify): Promise<void> => {
  const liveHandler = async (_request: any, reply: any) => {
    sendOk(reply, { status: 'alive', timestamp: isoNow() })
  }

  const readyHandler = async (request: any, reply: any) => {
    const prisma = fastify.prisma

    if (!prisma) {
      sendError(reply, 503, 'DB_NOT_READY', 'Database is not reachable')
      return
    }

    try {
      await withTimeout(prisma.$queryRaw`SELECT 1`, 1500)
      sendOk(reply, { status: 'ready', db: 'ok', timestamp: isoNow() })
    } catch (err) {
      request.log.error({ err }, 'Readiness check failed')
      sendError(reply, 503, 'DB_NOT_READY', 'Database is not reachable')
    }
  }

  fastify.get('/health/live', liveHandler)
  fastify.get('/api/health/live', liveHandler)

  fastify.get('/health/ready', readyHandler)
  fastify.get('/api/health/ready', readyHandler)
}

export default healthRoutes
