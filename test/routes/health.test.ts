import { test } from 'node:test'
import * as assert from 'node:assert'

import { build } from '../helper'

test('GET /health/live returns ok JSON', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    method: 'GET',
    url: '/health/live'
  })

  assert.equal(res.statusCode, 200)
  assert.equal(res.headers['content-type']?.includes('application/json'), true)

  const body = res.json()
  assert.equal(body.successful, true)
  assert.equal(body.error, null)
  assert.equal(body.data.status, 'alive')
  assert.equal(typeof body.data.timestamp, 'string')
})

test('GET /api/health/live returns ok JSON', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    method: 'GET',
    url: '/api/health/live'
  })

  assert.equal(res.statusCode, 200)
  assert.equal(res.headers['content-type']?.includes('application/json'), true)

  const body = res.json()
  assert.equal(body.successful, true)
  assert.equal(body.error, null)
  assert.equal(body.data.status, 'alive')
  assert.equal(typeof body.data.timestamp, 'string')
})

test('GET /health/ready returns 200 when DB reachable, otherwise 503', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    method: 'GET',
    url: '/health/ready'
  })

  assert.equal(res.headers['content-type']?.includes('application/json'), true)
  const body = res.json()

  if (res.statusCode === 200) {
    assert.equal(body.successful, true)
    assert.equal(body.error, null)
    assert.equal(body.data.status, 'ready')
    assert.equal(body.data.db, 'ok')
    return
  }

  assert.equal(res.statusCode, 503)
  assert.equal(body.successful, false)
  assert.equal(body.data, null)
  assert.equal(body.error.code, 'DB_NOT_READY')
})

test('GET /api/health/ready returns 200 when DB reachable, otherwise 503', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    method: 'GET',
    url: '/api/health/ready'
  })

  assert.equal(res.headers['content-type']?.includes('application/json'), true)
  const body = res.json()

  if (res.statusCode === 200) {
    assert.equal(body.successful, true)
    assert.equal(body.error, null)
    assert.equal(body.data.status, 'ready')
    assert.equal(body.data.db, 'ok')
    return
  }

  assert.equal(res.statusCode, 503)
  assert.equal(body.successful, false)
  assert.equal(body.data, null)
  assert.equal(body.error.code, 'DB_NOT_READY')
})

test('Unknown route returns JSON 404 in standard format', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    method: 'GET',
    url: '/does-not-exist'
  })

  assert.equal(res.statusCode, 404)
  assert.equal(res.headers['content-type']?.includes('application/json'), true)

  const body = res.json()
  assert.equal(body.successful, false)
  assert.equal(body.data, null)
  assert.equal(typeof body.error.code, 'string')
  assert.equal(typeof body.error.message, 'string')
})
