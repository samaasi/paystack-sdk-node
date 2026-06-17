import { verifyPaystackSignature } from '../webhooks/verifier'
import type { PaystackEvent } from '../enums/events'
import type { WebhookEvent } from '../resources/webhooks/webhooks.types'

export interface NextWebhookOptions {
  /** Your Paystack secret key used to verify webhook signatures */
  secretKey: string
  /** The header name to check for the signature (default: 'x-paystack-signature') */
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

/**
 * Verifies a Next.js App Router webhook request from Paystack.
 *
 * @param req - The Next.js request object
 * @param options - Configuration options for verification
 * @returns An object indicating if the request is valid and the parsed event
 *
 * @example
 * ```typescript
 * // app/api/paystack/webhook/route.ts
 * import { NextResponse } from 'next/server'
 * import { verifyPaystackNextjsRequest } from 'paystack-sdk-node/nextjs'
 * import type { PaystackEvent, WebhookEvent } from 'paystack-sdk-node'
 *
 * export async function POST(req: Request) {
 *   const { valid, event } = await verifyPaystackNextjsRequest(req, {
 *     secretKey: process.env.PAYSTACK_SECRET_KEY!
 *   })
 *
 *   if (!valid) {
 *     return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
 *   }
 *
 *   const webhookEvent = event as WebhookEvent
 *
 *   switch (webhookEvent.event) {
 *     case PaystackEvent.ChargeSuccess:
 *       // Handle successful charge
 *       console.log('Charge successful!', webhookEvent.data)
 *       break
 *   }
 *
 *   return NextResponse.json({ status: 'ok' })
 * }
 * ```
 */
export async function verifyPaystackNextjsRequest(
  req: NextRequestLike,
  options: NextWebhookOptions,
): Promise<{ valid: boolean; event?: WebhookEvent<unknown> | unknown }> {
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
    event = JSON.parse(rawBody) as WebhookEvent<unknown>
  } catch {
    event = rawBody
  }

  return { valid: true, event }
}
