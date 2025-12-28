import test from 'node:test'
import assert from 'node:assert'

import { build } from '../helper'

test('POST /api/auth/request-otp returns needToUsePassword=true for admin login (even without DB)', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/api/auth/request-otp',
    payload: { login: '+70000000000' }
  })

  assert.equal(res.statusCode, 200)

  const body = res.json()
  assert.equal(body.successful, true)
  assert.deepEqual(body.data, { needToUsePassword: true })
})
