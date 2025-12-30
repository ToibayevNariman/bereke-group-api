import test from 'node:test'
import assert from 'node:assert/strict'
import { build } from '../helper'

test('GET /api/projects-catalog returns wrapper + projects', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    method: 'GET',
    url: '/api/projects-catalog'
  })

  assert.ok([200, 503].includes(res.statusCode))

  const json = res.json()
  assert.equal(typeof json.successful, 'boolean')
  assert.ok('data' in json)
  assert.ok('error' in json)

  if (res.statusCode === 200) {
    assert.equal(json.successful, true)
    assert.ok(json.data)
    assert.ok(Array.isArray(json.data.projects))

    if (json.data.projects.length > 0) {
      const p = json.data.projects[0]
      assert.equal(typeof p.id, 'string')
      assert.equal(typeof p.name, 'string')
      assert.ok(Array.isArray(p.images))
      assert.equal(typeof p.style, 'string')
      assert.equal(typeof p.material, 'string')
      assert.equal(typeof p.price, 'number')
      assert.ok(p.details)
      assert.equal(typeof p.details.description, 'string')
      assert.ok(Array.isArray(p.details.structuralConceptBullets))
    }
  } else {
    assert.equal(json.successful, false)
  }
})
