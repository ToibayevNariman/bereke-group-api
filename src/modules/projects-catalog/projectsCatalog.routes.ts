import type { FastifyPluginAsync } from 'fastify'
import { ProjectsCatalogService } from './projectsCatalog.service'
import { getProjectsCatalogHandler, getProjectsCatalogHomeHandler } from './projectsCatalog.controller'
import { sendError } from '../../utils/apiResponse'

export const registerProjectsCatalogRoutes: FastifyPluginAsync = async (fastify): Promise<void> => {
  if (!fastify.prisma) {
    fastify.get('/', async (request, reply) => {
      sendError(reply, 503, 'DB_NOT_READY', request.t('errors.internal'))
    })

    fastify.get('/home', async (request, reply) => {
      sendError(reply, 503, 'DB_NOT_READY', request.t('errors.internal'))
    })
    return
  }

  const service = new ProjectsCatalogService(fastify.prisma)

  fastify.get('/', getProjectsCatalogHandler(service))
  fastify.get('/home', getProjectsCatalogHomeHandler(service))
}
