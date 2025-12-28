import type { FastifyReply } from 'fastify'

export type ApiError = {
  code: string
  message: string
  details?: any
}

export type ApiSuccessResponse<T> = {
  successful: true
  data: T
  error: null
}

export type ApiFailureResponse = {
  successful: false
  data: null
  error: ApiError
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiFailureResponse

export function buildOk<T>(data: T): ApiSuccessResponse<T> {
  return {
    successful: true,
    data,
    error: null
  }
}

export function buildError(code: string, message: string, details?: any): ApiFailureResponse {
  return {
    successful: false,
    data: null,
    error: details === undefined ? { code, message } : { code, message, details }
  }
}

export function sendOk<T>(reply: FastifyReply, data: T, statusCode = 200): void {
  reply.code(statusCode).type('application/json').send(buildOk(data))
}

export function sendError(
  reply: FastifyReply,
  statusCode: number,
  code: string,
  message: string,
  details?: any
): void {
  reply.code(statusCode).type('application/json').send(buildError(code, message, details))
}
