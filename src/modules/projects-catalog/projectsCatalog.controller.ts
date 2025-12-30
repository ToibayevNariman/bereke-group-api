import type { FastifyReply, FastifyRequest } from 'fastify'
import { Prisma } from '@prisma/client'
import { sendError, sendOk } from '../../utils/apiResponse'
import type { ProjectsCatalogService } from './projectsCatalog.service'

function isDbNotReadyError(err: unknown): boolean {
  if (err instanceof Prisma.PrismaClientInitializationError) return true

  const code =
    err && typeof err === 'object' && 'code' in err && typeof (err as any).code === 'string'
      ? ((err as any).code as string)
      : err && typeof err === 'object' && 'errorCode' in err && typeof (err as any).errorCode === 'string'
        ? ((err as any).errorCode as string)
        : undefined

  // Common Prisma connectivity/configuration errors (P1000+)
  if (code && /^P10\d\d$/.test(code)) return true

  // Schema not migrated / table/column missing
  if (code && ['P2021', 'P2022'].includes(code)) return true

  // Node-level network errors (Postgres not reachable)
  if (code && ['ECONNREFUSED', 'ETIMEDOUT', 'EHOSTUNREACH', 'ENOTFOUND'].includes(code)) return true

  const message = err instanceof Error ? err.message : ''
  if (
    /Can't reach database server|Database is not reachable|ECONNREFUSED|connect ECONNREFUSED|timeout|ETIMEDOUT/i.test(
      message
    )
  ) {
    return true
  }

  return false
}

export function getProjectsCatalogHandler(service: ProjectsCatalogService) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      const result = await service.getProjectsCatalog(request.locale)
      sendOk(reply, result)
    } catch (err) {
      request.log.error({ err }, 'projects-catalog failed')
      if (isDbNotReadyError(err)) {
        sendError(reply, 503, 'DB_NOT_READY', request.t('errors.internal'))
        return
      }

      sendError(reply, 500, 'INTERNAL', request.t('errors.internal'))
    }
  }
}

export function getProjectsCatalogHomeHandler(service: ProjectsCatalogService) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      const result = await service.getProjectsCatalogHome(request.locale)
      sendOk(reply, result)
    } catch (err) {
      request.log.error({ err }, 'projects-catalog home failed')
      if (isDbNotReadyError(err)) {
        sendError(reply, 503, 'DB_NOT_READY', request.t('errors.internal'))
        return
      }

      sendError(reply, 500, 'INTERNAL', request.t('errors.internal'))
    }
  }
}
