import { verifyPaystackSignature } from '../webhooks/verifier'

export interface NextWebhookOptions {
  secretKey: string
  headerName?: string
}

export interface NextRequestLike {
  headers: {
    get(name: string): string | null
  }
  text(): Promise<string>
}

function getHeader(
  headers: NextRequestLike['headers'],
  name: string,
): string | undefined {
  const value = headers.get(name) ?? headers.get(name.toLowerCase())
  return value ?? undefined
}

export async function verifyPaystackNextjsRequest(
  req: NextRequestLike,
  options: NextWebhookOptions,
): Promise<{ valid: boolean; event?: unknown }> {
  const headerName = options.headerName ?? 'x-paystack-signature'
  const signature = getHeader(req.headers, headerName)
  const rawBody = await req.text()

  const valid = await verifyPaystackSignature({
    payload: rawBody,
    signature,
    secretKey: options.secretKey,
  })

  if (!valid) {
    return { valid: false }
  }

  let event: unknown

  try {
    event = JSON.parse(rawBody)
  } catch {
    event = rawBody
  }

  return { valid: true, event }
}
