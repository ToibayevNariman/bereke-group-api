import { test } from 'node:test'
import * as assert from 'node:assert'

import { resolveLocale } from '../src/common/i18n'
import { build } from './helper'

test('resolveLocale: Accept-Language kk resolves to kk', () => {
  const locale = resolveLocale({ 'accept-language': 'kk-KZ,ru;q=0.8' })
  assert.equal(locale, 'kk')
})

test('resolveLocale: X-Lang overrides Accept-Language', () => {
  const locale = resolveLocale({ 'x-lang': 'en', 'accept-language': 'kk-KZ,ru;q=0.8' })
  assert.equal(locale, 'en')
})

test('notFound handler localizes error message by X-Lang', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    method: 'GET',
    url: '/does-not-exist',
    headers: {
      'x-lang': 'en'
    }
  })

  assert.equal(res.statusCode, 404)
  const body = res.json()
  assert.equal(body.successful, false)
  assert.equal(body.error.code, 'NOT_FOUND')
  assert.equal(body.error.message, 'Route not found')
})
