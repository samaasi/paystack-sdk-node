export function generateIdempotencyKey(): string {
  const globalCrypto: Crypto | undefined = (globalThis as any).crypto

  if (globalCrypto && typeof (globalCrypto as any).randomUUID === "function") {
    return (globalCrypto as any).randomUUID()
  }

  const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
  let value = ""

  for (let i = 0; i < 24; i += 1) {
    const index = Math.floor(Math.random() * chars.length)
    value += chars[index]
  }

  return value
}

export function withIdempotencyKey(
  init: RequestInit = {},
  idempotencyKey?: string,
): RequestInit {
  if (!idempotencyKey) {
    return init
  }

  const existing = init.headers

  if (!existing) {
    return {
      ...init,
      headers: {
        "x-idempotency-key": idempotencyKey,
      },
    }
  }

  if (existing instanceof Headers) {
    const clone = new Headers(existing)
    clone.set("x-idempotency-key", idempotencyKey)

    return {
      ...init,
      headers: clone,
    }
  }

  return {
    ...init,
    headers: {
      ...(existing as Record<string, string>),
      "x-idempotency-key": idempotencyKey,
    },
  }
}
