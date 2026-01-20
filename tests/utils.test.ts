import { describe, expect, test, mock, beforeEach } from 'bun:test'
import {
  generateIdempotencyKey,
  withIdempotencyKey,
} from '../src/utils/idempotency'

describe('Utils', () => {
  describe('generateIdempotencyKey', () => {
    test('returns a string', () => {
      const key = generateIdempotencyKey()
      expect(typeof key).toBe('string')
      expect(key.length).toBeGreaterThan(0)
    })

    test('returns unique values', () => {
      const key1 = generateIdempotencyKey()
      const key2 = generateIdempotencyKey()
      expect(key1).not.toBe(key2)
    })

    test('uses fallback if crypto.randomUUID is not available', () => {
      const originalCrypto = globalThis.crypto
      // @ts-ignore
      globalThis.crypto = undefined

      try {
        const key = generateIdempotencyKey()
        expect(typeof key).toBe('string')
        expect(key.length).toBe(24)
      } finally {
        // @ts-ignore
        globalThis.crypto = originalCrypto
      }
    })
  })

  describe('withIdempotencyKey', () => {
    test('adds header to empty init', () => {
      const result = withIdempotencyKey({}, 'key_123')
      expect(result.headers).toEqual({ 'x-idempotency-key': 'key_123' })
    })

    test('adds header to existing plain object headers', () => {
      const init = { headers: { 'Content-Type': 'application/json' } }
      const result = withIdempotencyKey(init, 'key_123')
      expect(result.headers).toEqual({
        'Content-Type': 'application/json',
        'x-idempotency-key': 'key_123',
      })
    })

    test('adds header to existing Headers object', () => {
      const headers = new Headers()
      headers.set('Content-Type', 'application/json')
      const init = { headers }

      const result = withIdempotencyKey(init, 'key_123')
      const resultHeaders = result.headers as Headers

      expect(resultHeaders.get('Content-Type')).toBe('application/json')
      expect(resultHeaders.get('x-idempotency-key')).toBe('key_123')
    })

    test('does nothing if key is missing', () => {
      const init = { method: 'POST' }
      const result = withIdempotencyKey(init)
      expect(result).toBe(init)
    })
  })
})
