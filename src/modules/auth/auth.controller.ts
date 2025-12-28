import type { FastifyReply, FastifyRequest } from 'fastify'
import { sendError, sendOk } from '../../utils/apiResponse'
import { ADMIN_LOGIN } from './auth.constants'
import type { AuthService } from './auth.service'

type RequestOtpBody = { login: string }

type LoginBody =
  | { login: string; password: string; otp?: never }
  | { login: string; otp: string; password?: never }

function ipFromRequest(request: FastifyRequest): string | undefined {
  // Fastify provides request.ip (trustProxy-dependent). Good enough for now.
  return (request as any).ip
}

export function requestOtpHandler(auth: AuthService) {
  return async function (request: FastifyRequest<{ Body: RequestOtpBody }>, reply: FastifyReply) {
    const login = request.body.login

    try {
      const result = await auth.requestOtp({
        login,
        ip: ipFromRequest(request),
        userAgent: request.headers['user-agent'],
        t: request.t
      })

      sendOk(reply, result)
    } catch (err: any) {
      const status = typeof err?.statusCode === 'number' ? err.statusCode : 500

      if (err?.message === 'ADMIN_PASSWORD_REQUIRED') {
        sendError(reply, 400, 'ADMIN_PASSWORD_REQUIRED', request.t('auth.admin_password_required'))
        return
      }

      if (err?.message === 'OTP_TOO_FREQUENT') {
        sendError(reply, 429, 'OTP_TOO_FREQUENT', request.t('auth.otp_too_frequent', { seconds: 30 }))
        return
      }

      if (err?.message === 'TOO_MANY_ATTEMPTS') {
        sendError(reply, 429, 'TOO_MANY_ATTEMPTS', request.t('auth.too_many_attempts'))
        return
      }

      request.log.error({ err }, 'request-otp failed')
      sendError(reply, status, 'INTERNAL', request.t('errors.internal'))
    }
  }
}

export function loginHandler(auth: AuthService) {
  return async function (request: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) {
    const body = request.body
    const login = body.login

    try {
      if (login.trim() === ADMIN_LOGIN) {
        if (!('password' in body) || typeof (body as any).password !== 'string') {
          sendError(reply, 400, 'ADMIN_PASSWORD_REQUIRED', request.t('auth.admin_password_required'))
          return
        }

        const result = await auth.loginWithAdminPassword({
          login,
          password: (body as any).password,
          t: request.t
        })

        sendOk(reply, result)
        return
      }

      if (!('otp' in body) || typeof (body as any).otp !== 'string') {
        sendError(reply, 400, 'OTP_REQUIRED', request.t('auth.otp_required'))
        return
      }

      const result = await auth.loginWithOtp({
        login,
        otp: (body as any).otp,
        ip: ipFromRequest(request),
        userAgent: request.headers['user-agent'],
        t: request.t
      })

      sendOk(reply, result)
    } catch (err: any) {
      if (err?.message === 'ADMIN_PASSWORD_REQUIRED') {
        sendError(reply, 400, 'ADMIN_PASSWORD_REQUIRED', request.t('auth.admin_password_required'))
        return
      }

      if (err?.message === 'INVALID_CREDENTIALS') {
        sendError(reply, 401, 'INVALID_CREDENTIALS', request.t('auth.invalid_credentials'))
        return
      }

      if (err?.message === 'OTP_NOT_REQUESTED') {
        sendError(reply, 400, 'OTP_NOT_REQUESTED', request.t('auth.otp_not_requested'))
        return
      }

      if (err?.message === 'OTP_INVALID') {
        sendError(reply, 401, 'OTP_INVALID', request.t('auth.otp_invalid'))
        return
      }

      if (err?.message === 'TOO_MANY_ATTEMPTS') {
        sendError(reply, 429, 'TOO_MANY_ATTEMPTS', request.t('auth.too_many_attempts'))
        return
      }

      if (err?.message === 'JWT_SECRET_NOT_SET') {
        sendError(reply, 500, 'JWT_NOT_CONFIGURED', request.t('auth.jwt_not_configured'))
        return
      }

      if (err?.message === 'ADMIN_NOT_CONFIGURED') {
        sendError(reply, 503, 'ADMIN_NOT_CONFIGURED', request.t('auth.admin_not_configured'))
        return
      }

      request.log.error({ err }, 'auth login failed')
      sendError(reply, 500, 'INTERNAL', request.t('errors.internal'))
    }
  }
}
