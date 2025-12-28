import crypto from 'node:crypto'
import type { FastifyBaseLogger } from 'fastify'
import type { PrismaClient } from '@prisma/client'
import { OtpStatus, UserType } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import {
  ACCESS_TOKEN_EXPIRES_IN_SECONDS,
  ADMIN_LOGIN,
  IDENTITY_LOCK_MS,
  OTP_CODE_MOCK,
  OTP_MAX_ATTEMPTS,
  OTP_RESEND_MIN_INTERVAL_MS,
  OTP_TTL_MS
} from './auth.constants'
import { sendOtpMock } from './sms.provider'

export type Translator = (key: string, params?: Record<string, any>) => string

export type RequestOtpResult =
  | { needToUsePassword: true }
  | { needToUsePassword: false; sent: true; expiresIn: number }

export type LoginSuccessResult = {
  accessToken: string
  tokenType: 'Bearer'
  expiresIn: number
  user: {
    id: string
    userType: UserType
    roles?: string[]
  }
}

function sha256Hex(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex')
}

function now(): Date {
  return new Date()
}

function normalizePhoneE164(login: string): string {
  return login.trim()
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET_NOT_SET')
  }
  return secret
}

function signAccessToken(payload: Record<string, any>): { token: string; expiresIn: number } {
  const secret = getJwtSecret()
  const expiresIn = ACCESS_TOKEN_EXPIRES_IN_SECONDS

  const token = jwt.sign(payload, secret, {
    algorithm: 'HS256',
    expiresIn
  })

  return { token, expiresIn }
}

function isBcryptHash(value: string): boolean {
  return value.startsWith('$2a$') || value.startsWith('$2b$') || value.startsWith('$2y$')
}

export class AuthService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly logger: FastifyBaseLogger
  ) {}

  async requestOtp(input: {
    login: string
    ip?: string
    userAgent?: string
    t: Translator
  }): Promise<RequestOtpResult> {
    const phone = normalizePhoneE164(input.login)

    if (phone === ADMIN_LOGIN) {
      return { needToUsePassword: true }
    }

    const existingIdentity = await this.prisma.authIdentity.findUnique({
      where: { phoneE164: phone }
    })

    const nowDate = now()

    if (existingIdentity?.lockedUntil && existingIdentity.lockedUntil > nowDate) {
      const err: any = new Error('TOO_MANY_ATTEMPTS')
      err.statusCode = 429
      throw err
    }

    if (existingIdentity?.lastOtpSentAt) {
      const deltaMs = nowDate.getTime() - existingIdentity.lastOtpSentAt.getTime()
      if (deltaMs >= 0 && deltaMs < OTP_RESEND_MIN_INTERVAL_MS) {
        const err: any = new Error('OTP_TOO_FREQUENT')
        err.statusCode = 429
        throw err
      }
    }

    // Schema requires AuthIdentity.userId, so we create a minimal User early.
    const identity = existingIdentity
      ? existingIdentity
      : await this.prisma.user
          .create({
            data: {
              userType: UserType.CLIENT,
              isActive: true
            }
          })
          .then(async (user) => {
            return await this.prisma.authIdentity.create({
              data: {
                userId: user.id,
                phoneE164: phone,
                isPrimary: true,
                isVerified: false
              }
            })
          })

    const expiresAt = new Date(nowDate.getTime() + OTP_TTL_MS)
    const codeHash = sha256Hex(OTP_CODE_MOCK)

    await this.prisma.authIdentity.update({
      where: { id: identity.id },
      data: {
        lastOtpSentAt: nowDate
      }
    })

    await this.prisma.otpChallenge.create({
      data: {
        identityId: identity.id,
        codeHash,
        expiresAt,
        status: OtpStatus.PENDING,
        maxAttempts: OTP_MAX_ATTEMPTS,
        requestIp: input.ip,
        userAgent: input.userAgent
      }
    })

    await sendOtpMock(this.logger, phone, OTP_CODE_MOCK)

    return { needToUsePassword: false, sent: true, expiresIn: Math.floor(OTP_TTL_MS / 1000) }
  }

  async loginWithAdminPassword(input: {
    login: string
    password: string
    t: Translator
  }): Promise<LoginSuccessResult> {
    if (input.login.trim() !== ADMIN_LOGIN) {
      const err: any = new Error('NOT_ADMIN_LOGIN')
      err.statusCode = 400
      throw err
    }

    const adminUser = await this.prisma.user.findFirst({
      where: { userType: UserType.SYSTEM_ADMIN },
      include: {
        systemAdminCredential: true,
        roles: { include: { role: true } }
      }
    })

    if (!adminUser?.systemAdminCredential) {
      const err: any = new Error('ADMIN_NOT_CONFIGURED')
      err.statusCode = 503
      throw err
    }

    const storedHash = adminUser.systemAdminCredential.passwordHash
    let ok = false

    if (isBcryptHash(storedHash)) {
      ok = await bcrypt.compare(input.password, storedHash)
    } else {
      // Dev fallback for older seed values.
      ok = input.password === storedHash
      if (ok) this.logger.warn('System admin passwordHash is not bcrypt; please migrate to bcrypt hash')
    }

    if (!ok) {
      const err: any = new Error('INVALID_CREDENTIALS')
      err.statusCode = 401
      throw err
    }

    const roleCodes = adminUser.roles.map((r) => r.role.code)

    const { token, expiresIn } = signAccessToken({
      sub: adminUser.id,
      userType: adminUser.userType,
      roles: roleCodes
    })

    return {
      accessToken: token,
      tokenType: 'Bearer',
      expiresIn,
      user: {
        id: adminUser.id,
        userType: adminUser.userType,
        roles: roleCodes
      }
    }
  }

  async loginWithOtp(input: {
    login: string
    otp: string
    ip?: string
    userAgent?: string
    t: Translator
  }): Promise<LoginSuccessResult> {
    const phone = normalizePhoneE164(input.login)

    if (phone === ADMIN_LOGIN) {
      const err: any = new Error('ADMIN_PASSWORD_REQUIRED')
      err.statusCode = 400
      throw err
    }

    const identity = await this.prisma.authIdentity.findUnique({
      where: { phoneE164: phone }
    })

    if (!identity) {
      const err: any = new Error('OTP_NOT_REQUESTED')
      err.statusCode = 400
      throw err
    }

    const nowDate = now()

    if (identity.lockedUntil && identity.lockedUntil > nowDate) {
      const err: any = new Error('TOO_MANY_ATTEMPTS')
      err.statusCode = 429
      throw err
    }

    const challenge = await this.prisma.otpChallenge.findFirst({
      where: {
        identityId: identity.id,
        status: OtpStatus.PENDING,
        expiresAt: { gt: nowDate }
      },
      orderBy: { createdAt: 'desc' }
    })

    if (!challenge) {
      const err: any = new Error('OTP_NOT_REQUESTED')
      err.statusCode = 400
      throw err
    }

    const inputHash = sha256Hex(input.otp)

    if (inputHash !== challenge.codeHash || input.otp !== OTP_CODE_MOCK) {
      const nextAttempts = challenge.verifyAttempts + 1
      const lockNow = nextAttempts >= challenge.maxAttempts

      await this.prisma.$transaction([
        this.prisma.otpAttempt.create({
          data: {
            challengeId: challenge.id,
            ip: input.ip,
            isSuccess: false,
            reason: 'WRONG_CODE'
          }
        }),
        this.prisma.otpChallenge.update({
          where: { id: challenge.id },
          data: {
            verifyAttempts: nextAttempts,
            status: lockNow ? OtpStatus.LOCKED : OtpStatus.PENDING
          }
        }),
        ...(lockNow
          ? [
              this.prisma.authIdentity.update({
                where: { id: identity.id },
                data: {
                  lockedUntil: new Date(nowDate.getTime() + IDENTITY_LOCK_MS),
                  failedAttempts: identity.failedAttempts + 1
                }
              })
            ]
          : [])
      ])

      const err: any = new Error(lockNow ? 'TOO_MANY_ATTEMPTS' : 'OTP_INVALID')
      err.statusCode = lockNow ? 429 : 401
      throw err
    }

    const user = await this.prisma.user.findUnique({
      where: { id: identity.userId },
      include: { roles: { include: { role: true } } }
    })

    if (!user) {
      const err: any = new Error('INTERNAL_USER_NOT_FOUND')
      err.statusCode = 500
      throw err
    }

    await this.prisma.$transaction([
      this.prisma.otpAttempt.create({
        data: {
          challengeId: challenge.id,
          ip: input.ip,
          isSuccess: true,
          reason: null
        }
      }),
      this.prisma.otpChallenge.update({
        where: { id: challenge.id },
        data: {
          status: OtpStatus.VERIFIED,
          verifiedAt: nowDate
        }
      }),
      this.prisma.authIdentity.update({
        where: { id: identity.id },
        data: {
          failedAttempts: 0,
          lockedUntil: null
        }
      })
    ])

    const roleCodes = user.roles.map((r) => r.role.code)

    const { token, expiresIn } = signAccessToken({
      sub: user.id,
      userType: user.userType,
      roles: roleCodes
    })

    return {
      accessToken: token,
      tokenType: 'Bearer',
      expiresIn,
      user: {
        id: user.id,
        userType: user.userType,
        roles: roleCodes
      }
    }
  }
}
