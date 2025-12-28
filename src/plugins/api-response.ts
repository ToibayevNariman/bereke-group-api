import fp from 'fastify-plugin'
import type { FastifyError, FastifyPluginAsync } from 'fastify'
import { sendError } from '../utils/apiResponse'

function pickErrorResponse(statusCode: number, error: FastifyError) {
  const validation = (error as any).validation
  if (validation) {
    return {
      statusCode: 400,
      code: 'VALIDATION_FAILED',
      messageKey: 'errors.validation_failed',
      details: validation
    }
  }

  if (statusCode === 401) {
    return { statusCode: 401, code: 'UNAUTHORIZED', messageKey: 'errors.unauthorized' }
  }

  if (statusCode === 403) {
    return { statusCode: 403, code: 'FORBIDDEN', messageKey: 'errors.forbidden' }
  }

  if (statusCode === 404) {
    return { statusCode: 404, code: 'NOT_FOUND', messageKey: 'errors.not_found' }
  }

  if (statusCode === 429) {
    return { statusCode: 429, code: 'TOO_MANY_REQUESTS', messageKey: 'errors.too_many_requests' }
  }

  if (statusCode === 400) {
    return { statusCode: 400, code: 'BAD_REQUEST', messageKey: 'errors.bad_request' }
  }

  if (statusCode >= 500) {
    return { statusCode: 500, code: 'INTERNAL', messageKey: 'errors.internal' }
  }

  // Fallback for other 4xx/5xx.
  return { statusCode, code: 'BAD_REQUEST', messageKey: 'errors.bad_request' }
}

const apiResponsePlugin: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.setNotFoundHandler(async (request, reply) => {
    sendError(reply, 404, 'NOT_FOUND', request.t('errors.not_found'))
  })

  fastify.setErrorHandler(async (error: FastifyError, request, reply) => {
    const statusCode = typeof error.statusCode === 'number' ? error.statusCode : 500

    // Log full error server-side.
    request.log.error({ err: error }, 'Request failed')

    const picked = pickErrorResponse(statusCode, error)
    sendError(reply, picked.statusCode, picked.code, request.t(picked.messageKey), picked.details)
  })
}

export default fp(apiResponsePlugin, {
  name: 'api-response'
})
