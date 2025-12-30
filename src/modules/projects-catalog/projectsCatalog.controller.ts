import type { FastifyReply, FastifyRequest } from 'fastify'
import { sendError, sendOk } from '../../utils/apiResponse'
import type { ProjectsCatalogService } from './projectsCatalog.service'

export function getProjectsCatalogHandler(service: ProjectsCatalogService) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      const result = await service.getProjectsCatalog(request.locale)
      sendOk(reply, result)
    } catch (err) {
      request.log.error({ err }, 'projects-catalog failed')
      sendError(reply, 500, 'INTERNAL', request.t('errors.internal'))
    }
  }
}
