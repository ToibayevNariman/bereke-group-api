import test from 'node:test'
import assert from 'node:assert'

import { AuthService } from '../../src/modules/auth/auth.service'
import { OTP_TTL_MS } from '../../src/modules/auth/auth.constants'

test('AuthService.requestOtp: unknown phone returns silent success and has no DB side-effects', async () => {
  const prismaMock: any = {
    authIdentity: {
      findUnique: async () => null,
      update: async () => {
        throw new Error('authIdentity.update should not be called for unknown phone')
      }
    },
    otpChallenge: {
      create: async () => {
        throw new Error('otpChallenge.create should not be called for unknown phone')
      }
    },
    user: {
      create: async () => {
        throw new Error('user.create should not be called for unknown phone')
      }
    }
  }

  const loggerMock: any = { info: () => {}, warn: () => {}, error: () => {}, debug: () => {} }

  const auth = new AuthService(prismaMock, loggerMock)

  const result = await auth.requestOtp({
    login: '+79990000000',
    t: (k) => k
  })

  assert.deepEqual(result, {
    needToUsePassword: false,
    sent: true,
    expiresIn: Math.floor(OTP_TTL_MS / 1000)
  })
})

test('AuthService.loginWithOtp: unknown phone returns USER_NOT_FOUND', async () => {
  const prismaMock: any = {
    authIdentity: {
      findUnique: async () => null
    }
  }

  const loggerMock: any = { info: () => {}, warn: () => {}, error: () => {}, debug: () => {} }

  const auth = new AuthService(prismaMock, loggerMock)

  await assert.rejects(
    () =>
      auth.loginWithOtp({
        login: '+79990000000',
        otp: '123456',
        t: (k) => k
      }),
    (err: any) => {
      assert.equal(err?.message, 'USER_NOT_FOUND')
      assert.equal(err?.statusCode, 404)
      return true
    }
  )
})
