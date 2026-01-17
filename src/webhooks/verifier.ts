export interface VerifyPaystackSignatureOptions {
  payload: string | Uint8Array
  signature: string | null | undefined
  secretKey: string
}

function toHex(bytes: Uint8Array): string {
  let hex = ""

  for (let i = 0; i < bytes.length; i += 1) {
    const value = bytes[i]!
    hex += value.toString(16).padStart(2, "0")
  }

  return hex
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }

  let diff = 0

  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }

  return diff === 0
}

async function computeWithSubtle(
  secretKey: string,
  payload: string | Uint8Array,
): Promise<string> {
  const cryptoObj: Crypto | undefined = (globalThis as any).crypto

  if (!cryptoObj?.subtle) {
    throw new Error("subtle crypto not available")
  }

  const encoder = new TextEncoder()
  const keyData = encoder.encode(secretKey)
  const data =
    typeof payload === "string"
      ? encoder.encode(payload)
      : payload

  const key = await cryptoObj.subtle.importKey(
    "raw",
    keyData as any,
    {
      name: "HMAC",
      hash: "SHA-512",
    },
    false,
    ["sign"],
  )

  const signature = await cryptoObj.subtle.sign("HMAC", key, data as any)
  return toHex(new Uint8Array(signature))
}

async function computeWithNodeCrypto(
  secretKey: string,
  payload: string | Uint8Array,
): Promise<string> {
  const nodeCrypto = await import("node:crypto")
  const hmac = nodeCrypto.createHmac("sha512", secretKey)

  if (typeof payload === "string") {
    hmac.update(payload, "utf8")
  } else {
    hmac.update(Buffer.from(payload))
  }

  return hmac.digest("hex")
}

export async function computePaystackSignature(
  secretKey: string,
  payload: string | Uint8Array,
): Promise<string> {
  try {
    return await computeWithNodeCrypto(secretKey, payload)
  } catch {
  }

  return computeWithSubtle(secretKey, payload)
}

export async function verifyPaystackSignature(
  options: VerifyPaystackSignatureOptions,
): Promise<boolean> {
  const headerSignature = options.signature

  if (!headerSignature) {
    return false
  }

  const normalizedHeader = headerSignature.trim().toLowerCase()
  const computed = (await computePaystackSignature(
    options.secretKey,
    options.payload,
  )).toLowerCase()

  return timingSafeEqualHex(normalizedHeader, computed)
}
