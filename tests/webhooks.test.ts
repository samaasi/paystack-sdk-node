import { describe, expect, test } from 'bun:test'
import {
  computePaystackSignature,
  verifyPaystackSignature,
} from '../src/webhooks/verifier'
import { createPaystackExpressMiddleware } from '../src/integrations/express'
import { createPaystackFastifyHook } from '../src/integrations/fastify'
import { verifyPaystackNextjsRequest } from '../src/integrations/nextjs'

const SECRET = 'sk_test_webhook_secret'
const PAYLOAD = JSON.stringify({ event: 'charge.success', data: { amount: 5000 } })

async function makeSignature(secret: string, payload: string): Promise<string> {
  return computePaystackSignature(secret, payload)
}

// ---------------------------------------------------------------------------
// computePaystackSignature
// ---------------------------------------------------------------------------
describe('computePaystackSignature', () => {
  test('returns a non-empty hex string', async () => {
    const sig = await makeSignature(SECRET, PAYLOAD)
    expect(sig).toMatch(/^[0-9a-f]+$/)
  })

  test('is deterministic for the same inputs', async () => {
    const a = await makeSignature(SECRET, PAYLOAD)
    const b = await makeSignature(SECRET, PAYLOAD)
    expect(a).toBe(b)
  })

  test('produces different signatures for different secrets', async () => {
    const a = await makeSignature(SECRET, PAYLOAD)
    const b = await makeSignature('other_secret', PAYLOAD)
    expect(a).not.toBe(b)
  })

  test('produces different signatures for different payloads', async () => {
    const a = await makeSignature(SECRET, PAYLOAD)
    const b = await makeSignature(SECRET, '{}')
    expect(a).not.toBe(b)
  })
})

// ---------------------------------------------------------------------------
// verifyPaystackSignature
// ---------------------------------------------------------------------------
describe('verifyPaystackSignature', () => {
  test('returns true for a valid signature', async () => {
    const signature = await makeSignature(SECRET, PAYLOAD)
    const result = await verifyPaystackSignature({
      payload: PAYLOAD,
      signature,
      secretKey: SECRET,
    })
    expect(result).toBe(true)
  })

  test('returns false for a tampered payload', async () => {
    const signature = await makeSignature(SECRET, PAYLOAD)
    const result = await verifyPaystackSignature({
      payload: '{"event":"charge.failed"}',
      signature,
      secretKey: SECRET,
    })
    expect(result).toBe(false)
  })

  test('returns false for a tampered signature', async () => {
    const result = await verifyPaystackSignature({
      payload: PAYLOAD,
      signature: 'deadbeefdeadbeef',
      secretKey: SECRET,
    })
    expect(result).toBe(false)
  })

  test('returns false when signature is null', async () => {
    const result = await verifyPaystackSignature({
      payload: PAYLOAD,
      signature: null,
      secretKey: SECRET,
    })
    expect(result).toBe(false)
  })

  test('returns false when signature is undefined', async () => {
    const result = await verifyPaystackSignature({
      payload: PAYLOAD,
      signature: undefined,
      secretKey: SECRET,
    })
    expect(result).toBe(false)
  })

  test('returns false when signature is empty string', async () => {
    const result = await verifyPaystackSignature({
      payload: PAYLOAD,
      signature: '',
      secretKey: SECRET,
    })
    expect(result).toBe(false)
  })

  test('accepts uppercase signature (case-insensitive)', async () => {
    const signature = (await makeSignature(SECRET, PAYLOAD)).toUpperCase()
    const result = await verifyPaystackSignature({
      payload: PAYLOAD,
      signature,
      secretKey: SECRET,
    })
    expect(result).toBe(true)
  })

  test('accepts Uint8Array payload', async () => {
    const encoder = new TextEncoder()
    const payloadBytes = encoder.encode(PAYLOAD)
    const signature = await makeSignature(SECRET, PAYLOAD)
    const result = await verifyPaystackSignature({
      payload: payloadBytes,
      signature,
      secretKey: SECRET,
    })
    expect(result).toBe(true)
  })

  test('returns false for wrong secret', async () => {
    const signature = await makeSignature('wrong_secret', PAYLOAD)
    const result = await verifyPaystackSignature({
      payload: PAYLOAD,
      signature,
      secretKey: SECRET,
    })
    expect(result).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// Express middleware
// ---------------------------------------------------------------------------
describe('Express middleware', () => {
  function makeReq(overrides: Record<string, unknown> = {}) {
    return {
      rawBody: undefined as Buffer | undefined,
      body: undefined as unknown,
      headers: {} as Record<string, string>,
      paystackEvent: undefined,
      ...overrides,
    }
  }

  function makeRes() {
    let statusCode = 200
    let body: unknown
    return {
      get statusCode() { return statusCode },
      get body() { return body },
      status(code: number) { statusCode = code; return this },
      json(b: unknown) { body = b; return this },
      send(b: unknown) { body = b; return this },
    }
  }

  test('calls next() for a valid signature with rawBody Buffer', async () => {
    const middleware = createPaystackExpressMiddleware({ secretKey: SECRET })
    const sig = await makeSignature(SECRET, PAYLOAD)
    const req = makeReq({
      rawBody: Buffer.from(PAYLOAD),
      headers: { 'x-paystack-signature': sig },
    })
    const res = makeRes()
    let nextCalled = false
    await middleware(req as any, res as any, () => { nextCalled = true })
    expect(nextCalled).toBe(true)
    expect((req as any).paystackEvent).toBeDefined()
  })

  test('responds 400 when rawBody is missing', async () => {
    const middleware = createPaystackExpressMiddleware({ secretKey: SECRET })
    const req = makeReq({ headers: { 'x-paystack-signature': 'abc' } })
    const res = makeRes()
    let nextCalled = false
    await middleware(req as any, res as any, () => { nextCalled = true })
    expect(nextCalled).toBe(false)
    expect(res.statusCode).toBe(400)
  })

  test('responds 401 for invalid signature', async () => {
    const middleware = createPaystackExpressMiddleware({ secretKey: SECRET })
    const req = makeReq({
      rawBody: Buffer.from(PAYLOAD),
      headers: { 'x-paystack-signature': 'badsig' },
    })
    const res = makeRes()
    let nextCalled = false
    await middleware(req as any, res as any, () => { nextCalled = true })
    expect(nextCalled).toBe(false)
    expect(res.statusCode).toBe(401)
  })
})

// ---------------------------------------------------------------------------
// Fastify hook
// ---------------------------------------------------------------------------
describe('Fastify hook', () => {
  function makeReq(overrides: Record<string, unknown> = {}) {
    return {
      rawBody: undefined as string | undefined,
      body: undefined as unknown,
      headers: {} as Record<string, string>,
      paystackEvent: undefined,
      ...overrides,
    }
  }

  function makeReply() {
    let _code = 200
    let _body: unknown
    return {
      get code_() { return _code },
      get body_() { return _body },
      code(c: number) { _code = c; return this },
      send(b: unknown) { _body = b; return this },
    }
  }

  test('resolves for a valid signature with rawBody string', async () => {
    const hook = createPaystackFastifyHook({ secretKey: SECRET })
    const sig = await makeSignature(SECRET, PAYLOAD)
    const req = makeReq({
      rawBody: PAYLOAD,
      headers: { 'x-paystack-signature': sig },
      body: JSON.parse(PAYLOAD),
    })
    const reply = makeReply()
    await hook(req as any, reply as any)
    expect((req as any).paystackEvent).toBeDefined()
  })

  test('sends 400 and returns when rawBody is absent', async () => {
    const hook = createPaystackFastifyHook({ secretKey: SECRET })
    const req = makeReq({ headers: { 'x-paystack-signature': 'abc' } })
    const reply = makeReply()
    await hook(req as any, reply as any)
    expect(reply.code_).toBe(400)
  })

  test('sends 401 for invalid signature', async () => {
    const hook = createPaystackFastifyHook({ secretKey: SECRET })
    const req = makeReq({
      rawBody: PAYLOAD,
      headers: { 'x-paystack-signature': 'invalidsig' },
    })
    const reply = makeReply()
    await hook(req as any, reply as any)
    expect(reply.code_).toBe(401)
  })
})

// ---------------------------------------------------------------------------
// Next.js helper
// ---------------------------------------------------------------------------
describe('Next.js verifyPaystackNextjsRequest', () => {
  function makeRequest(body: string, sig: string | null) {
    const headers = new Headers()
    if (sig !== null) headers.set('x-paystack-signature', sig)
    return {
      text: async () => body,
      headers,
    }
  }

  test('returns valid=true and event for a correct signature', async () => {
    const sig = await makeSignature(SECRET, PAYLOAD)
    const req = makeRequest(PAYLOAD, sig)
    const result = await verifyPaystackNextjsRequest(req as any, { secretKey: SECRET })
    expect(result.valid).toBe(true)
    expect(result.event).toBeDefined()
  })

  test('returns valid=false for an incorrect signature', async () => {
    const req = makeRequest(PAYLOAD, 'badsig')
    const result = await verifyPaystackNextjsRequest(req as any, { secretKey: SECRET })
    expect(result.valid).toBe(false)
    expect(result.event).toBeUndefined()
  })

  test('returns valid=false when signature header is missing', async () => {
    const req = makeRequest(PAYLOAD, null)
    const result = await verifyPaystackNextjsRequest(req as any, { secretKey: SECRET })
    expect(result.valid).toBe(false)
  })
})
