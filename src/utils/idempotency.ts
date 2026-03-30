import type { HeadersInit, RequestInitLike } from '../core/api-client'

function isForEachHeaders(
  value: unknown,
): value is { forEach: (cb: (value: string, key: string) => void) => void } {
  if (!value || typeof value !== 'object') {
    return false
  }

  const record = value as Record<string, unknown>
  return typeof record.forEach === 'function'
}

function normalizeHeaders(existing: unknown): Record<string, string> {
  const headers: Record<string, string> = {}

  if (!existing) {
    return headers
  }

  if (Array.isArray(existing)) {
    for (const entry of existing) {
      if (!Array.isArray(entry) || entry.length < 2) {
        continue
      }

      const key = String(entry[0])
      const value = String(entry[1])

      if (!key) {
        continue
      }

      headers[key] = value
    }

    return headers
  }

  if (isForEachHeaders(existing)) {
    existing.forEach((value, key) => {
      headers[key] = value
    })

    return headers
  }

  for (const [key, value] of Object.entries(existing as Record<string, unknown>)) {
    if (value === undefined) {
      continue
    }

    headers[key] = String(value)
  }

  return headers
}

export function generateIdempotencyKey(): string {
  const globalCrypto = (globalThis as { crypto?: Crypto }).crypto

  if (globalCrypto && typeof globalCrypto.randomUUID === 'function') {
    return globalCrypto.randomUUID()
  }

  if (!globalCrypto || typeof globalCrypto.getRandomValues !== 'function') {
    throw new Error('No cryptographically secure random source available')
  }

  const bytes = new Uint8Array(12)
  globalCrypto.getRandomValues(bytes)

  let hex = ''

  for (let i = 0; i < bytes.length; i += 1) {
    const value = bytes[i]!
    hex += value.toString(16).padStart(2, '0')
  }

  return hex
}

export function withIdempotencyKey(
  init: RequestInitLike = {},
  idempotencyKey?: string,
): RequestInitLike {
  if (!idempotencyKey) {
    return init
  }

  const headers = normalizeHeaders(init.headers)
  headers['x-idempotency-key'] = idempotencyKey

  return {
    ...init,
    headers: headers satisfies HeadersInit,
  }
}
