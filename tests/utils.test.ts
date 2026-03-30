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
      const originalGetRandomValues = originalCrypto?.getRandomValues

      try {
        // @ts-ignore
        globalThis.crypto = {
          getRandomValues: <T extends ArrayBufferView | null>(array: T): T => {
            if (!array) {
              return array
            }

            const view = new Uint8Array(
              array.buffer,
              array.byteOffset,
              array.byteLength,
            )

            for (let i = 0; i < view.length; i += 1) {
              view[i] = i + 1
            }

            return array
          },
        }

        const key = generateIdempotencyKey()
        expect(typeof key).toBe('string')
        expect(key.length).toBe(24)
      } finally {
        // @ts-ignore
        globalThis.crypto = originalCrypto
        if (originalCrypto && originalGetRandomValues) {
          originalCrypto.getRandomValues = originalGetRandomValues
        }
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
      const init = { headers } as any

      const result = withIdempotencyKey(init, 'key_123')
      const resultHeaders = result.headers as Record<string, string>
      const contentType =
        resultHeaders['Content-Type'] ?? resultHeaders['content-type']

      expect(contentType).toBe('application/json')
      expect(resultHeaders['x-idempotency-key']).toBe('key_123')
    })

    test('adds header to existing header tuples', () => {
      const init = {
        headers: [['Content-Type', 'application/json']] as any,
      }

      const result = withIdempotencyKey(init, 'key_123')
      const resultHeaders = result.headers as Record<string, string>

      expect(resultHeaders['Content-Type']).toBe('application/json')
      expect(resultHeaders['x-idempotency-key']).toBe('key_123')
    })

    test('does nothing if key is missing', () => {
      const init = { method: 'POST' }
      const result = withIdempotencyKey(init)
      expect(result).toBe(init)
    })
  })

  describe('Webhooks', () => {
    test('computePaystackSignature uses Uint8Array view for subtle crypto', async () => {
      const originalCrypto = globalThis.crypto
      const originalBuffer = (globalThis as any).Buffer
      const original = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8])
      const slice = original.subarray(2, 6)
      const expectedHex = Array.from(slice)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')

      // @ts-ignore
      globalThis.crypto = {
        subtle: {
          importKey: async () => ({}),
          sign: async (_algo: unknown, _key: unknown, data: unknown) => {
            const bytes = data instanceof ArrayBuffer ? new Uint8Array(data) : new Uint8Array()
            return Uint8Array.from(bytes).buffer
          },
        },
      } as any
      // @ts-ignore
      globalThis.Buffer = undefined

      try {
        const { computePaystackSignature } = await import(
          '../src/webhooks/verifier'
        )
        const result = await computePaystackSignature('sk_test', slice)
        expect(result).toBe(expectedHex)
      } finally {
        // @ts-ignore
        globalThis.crypto = originalCrypto
        // @ts-ignore
        globalThis.Buffer = originalBuffer
      }
    })

    test('computePaystackSignature throws when subtle crypto is unavailable and node crypto path fails', async () => {
      const originalCrypto = globalThis.crypto
      const originalBuffer = (globalThis as any).Buffer
      // @ts-ignore
      globalThis.crypto = undefined
      // @ts-ignore
      globalThis.Buffer = undefined

      try {
        const { computePaystackSignature } = await import(
          '../src/webhooks/verifier'
        )
        await expect(
          computePaystackSignature('sk_test', new Uint8Array([1, 2, 3])),
        ).rejects.toThrow('subtle crypto not available')
      } finally {
        // @ts-ignore
        globalThis.crypto = originalCrypto
        // @ts-ignore
        globalThis.Buffer = originalBuffer
      }
    })
  })
})
