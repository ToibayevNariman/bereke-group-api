import fp from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'
import { createTranslator, resolveLocale } from '../common/i18n'

const i18nPlugin: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.decorateRequest('locale', 'ru')
  fastify.decorateRequest('t', createTranslator('ru'))

  fastify.addHook('onRequest', async (request) => {
    const locale = resolveLocale(request.headers as any)
    request.locale = locale
    request.t = createTranslator(locale)
  })
}

export default fp(i18nPlugin, {
  name: 'i18n'
})
