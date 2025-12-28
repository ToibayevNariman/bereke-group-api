export const requestOtpSchema = {
  body: {
    type: 'object',
    additionalProperties: false,
    required: ['login'],
    properties: {
      login: { type: 'string', minLength: 1 }
    }
  }
} as const

export const loginSchema = {
  body: {
    type: 'object',
    additionalProperties: false,
    required: ['login'],
    properties: {
      login: { type: 'string', minLength: 1 },
      password: { type: 'string' },
      otp: { type: 'string' }
    },
    anyOf: [
      { required: ['password'] },
      { required: ['otp'] }
    ]
  }
} as const
