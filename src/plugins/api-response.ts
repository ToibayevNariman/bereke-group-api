import fp from 'fastify-plugin'
import type { FastifyError, FastifyPluginAsync } from 'fastify'
import { sendError } from '../utils/apiResponse'

function safeMessage(statusCode: number, error: FastifyError): string {
  if (statusCode >= 500) return 'Internal Server Error'

  // Avoid leaking internals but keep 4xx useful.
  if (statusCode === 404) return 'Route not found'
  if (statusCode === 405) return 'Method not allowed'

  // fastify validation / sensible errors have safe messages; keep them.
  if (typeof error.message === 'string' && error.message.length > 0) return error.message
  return 'Request failed'
}

function stableCode(statusCode: number, error: FastifyError): string {
  // Prefer Fastify/Sensible codes when present, but normalize for 5xx.
  if (statusCode >= 500) return 'INTERNAL_SERVER_ERROR'

  if (typeof (error as any).code === 'string' && (error as any).code.length > 0) {
    return String((error as any).code)
  }

  switch (statusCode) {
    case 400:
      return 'BAD_REQUEST'
    case 401:
      return 'UNAUTHORIZED'
    case 403:
      return 'FORBIDDEN'
    case 404:
      return 'NOT_FOUND'
    case 405:
      return 'METHOD_NOT_ALLOWED'
    case 413:
      return 'PAYLOAD_TOO_LARGE'
    case 415:
      return 'UNSUPPORTED_MEDIA_TYPE'
    case 422:
      return 'UNPROCESSABLE_ENTITY'
    case 429:
      return 'TOO_MANY_REQUESTS'
    default:
      return 'REQUEST_FAILED'
  }
}

const apiResponsePlugin: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.setNotFoundHandler(async (request, reply) => {
    sendError(reply, 404, 'NOT_FOUND', 'Route not found')
  })

  fastify.setErrorHandler(async (error: FastifyError, request, reply) => {
    const statusCode = typeof error.statusCode === 'number' ? error.statusCode : 500

    // Log full error server-side.
    request.log.error({ err: error }, 'Request failed')

    sendError(reply, statusCode, stableCode(statusCode, error), safeMessage(statusCode, error))
  })
}

export default fp(apiResponsePlugin, {
  name: 'api-response'
})
