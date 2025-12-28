import type { FastifyReply } from 'fastify'

export type ApiError = {
  code: string
  message: string
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

export function buildError(code: string, message: string): ApiFailureResponse {
  return {
    successful: false,
    data: null,
    error: { code, message }
  }
}

export function sendOk<T>(reply: FastifyReply, data: T, statusCode = 200): void {
  reply.code(statusCode).type('application/json').send(buildOk(data))
}

export function sendError(
  reply: FastifyReply,
  statusCode: number,
  code: string,
  message: string
): void {
  reply.code(statusCode).type('application/json').send(buildError(code, message))
}
