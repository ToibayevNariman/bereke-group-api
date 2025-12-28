import type { Locale } from '../common/i18n'

declare module 'fastify' {
  interface FastifyRequest {
    locale: Locale
    t: (key: string, params?: Record<string, any>) => string
  }
}

export {}
