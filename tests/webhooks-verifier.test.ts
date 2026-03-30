import { describe, expect, test } from 'bun:test'
import { computePaystackSignature, verifyPaystackSignature } from '../src/webhooks/verifier'

describe('Webhooks Verifier', () => {
  test('computePaystackSignature matches node crypto HMAC SHA-512', async () => {
    const secretKey = 'sk_test_123'
    const payload = '{"event":"charge.success","data":{"id":1}}'

    const nodeCrypto = await import('node:crypto')
    const expected = (nodeCrypto as any)
      .createHmac('sha512', secretKey)
      .update(payload, 'utf8')
      .digest('hex')

    const result = await computePaystackSignature(secretKey, payload)
    expect(result).toBe(expected)
  })

  test('verifyPaystackSignature returns true for valid signature (trim + case-insensitive)', async () => {
    const secretKey = 'sk_test_123'
    const payload = '{"event":"charge.success","data":{"id":1}}'
    const signature = await computePaystackSignature(secretKey, payload)

    const valid = await verifyPaystackSignature({
      secretKey,
      payload,
      signature: `  ${signature.toUpperCase()}  `,
    })

    expect(valid).toBe(true)
  })

  test('verifyPaystackSignature returns false when signature header is missing', async () => {
    const valid = await verifyPaystackSignature({
      secretKey: 'sk_test_123',
      payload: 'payload',
      signature: undefined,
    })

    expect(valid).toBe(false)
  })

  test('verifyPaystackSignature returns false when signature does not match', async () => {
    const secretKey = 'sk_test_123'
    const payload = 'payload'

    const valid = await verifyPaystackSignature({
      secretKey,
      payload,
      signature: 'deadbeef',
    })

    expect(valid).toBe(false)
  })

  test('verifyPaystackSignature returns false when signature length differs', async () => {
    const secretKey = 'sk_test_123'
    const payload = 'payload'
    const signature = await computePaystackSignature(secretKey, payload)

    const valid = await verifyPaystackSignature({
      secretKey,
      payload,
      signature: signature.slice(0, -1),
    })

    expect(valid).toBe(false)
  })
})
