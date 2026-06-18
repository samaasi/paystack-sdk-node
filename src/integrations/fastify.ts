import { verifyPaystackSignature } from '../webhooks/verifier'
import type { PaystackEvent } from '../enums/events'
import type { WebhookEvent } from '../resources/webhooks/webhooks.types'

export interface FastifyWebhookOptions {
  /** Your Paystack secret key used to verify webhook signatures */
  secretKey: string
  /** The header name to check for the signature (default: 'x-paystack-signature') */
  headerName?: string
}

// Structural typing for Fastify Request to avoid hard dependency
export interface FastifyLikeRequest {
  body: unknown
  headers: Record<string, unknown>
  rawBody?: string | Buffer
  paystackEvent?: WebhookEvent<unknown>
  [key: string]: unknown
}

export interface FastifyLikeReply {
  code(statusCode: number): FastifyLikeReply
  send(payload: unknown): FastifyLikeReply
}

export type FastifyDoneCallback = (err?: Error) => void

function getHeader(
  headers: Record<string, unknown>,
  name: string,
): string | undefined {
  const lower = name.toLowerCase()
  const indexed = headers as Record<string, unknown>
  const value = indexed[lower] ?? indexed[name]

  if (Array.isArray(value)) {
    return value[0]
  }

  return value as string | undefined
}

/**
 * Creates a Fastify preValidation hook to verify Paystack webhooks.
 *
 * **Important**: To use this hook, you should configure Fastify to parse the raw request body.
 * Consider using the `fastify-raw-body` plugin or similar configuration.
 *
 * @param options - Configuration options for the hook
 * @returns A Fastify preValidation hook that verifies webhook signatures
 *
 * @example
 * ```typescript
 * import fastify from 'fastify'
 * import fastifyRawBody from 'fastify-raw-body'
 * import { createPaystackFastifyHook } from 'paystack-sdk-node/fastify'
 * import type { PaystackEvent, WebhookEvent } from 'paystack-sdk-node'
 *
 * const app = fastify()
 *
 * // Register raw body plugin
 * app.register(fastifyRawBody, {
 *   field: 'rawBody',
 *   global: false,
 *   encoding: 'utf8'
 * })
 *
 * // Add Paystack webhook hook to specific route
 * app.post('/paystack/webhook', {
 *   preValidation: createPaystackFastifyHook({ secretKey: 'sk_test_your_secret_key' })
 * }, async (req, reply) => {
 *   const event = req.paystackEvent as WebhookEvent
 *
 *   switch (event.event) {
 *     case PaystackEvent.ChargeSuccess:
 *       // Handle successful charge
 *       console.log('Charge successful!', event.data)
 *       break
 *   }
 *
 *   return { status: 'ok' }
 * })
 *
 * app.listen({ port: 3000 })
 * ```
 */
export function createPaystackFastifyHook(options: FastifyWebhookOptions) {
  const headerName = (
    options.headerName ?? 'x-paystack-signature'
  ).toLowerCase()

  return async function paystackWebhookHook(
    req: FastifyLikeRequest,
    reply: FastifyLikeReply,
  ) {
    // In Fastify, raw body handling often requires specific configuration.
    // We assume the user has configured Fastify to keep the raw body,
    // or we try to reconstruct it if it's simple.
    // Ideally, users should use 'fastify-raw-body' plugin.

    let rawBody: string | undefined

    if (typeof req.rawBody === 'string') {
      rawBody = req.rawBody
    } else if (req.rawBody instanceof Buffer) {
      rawBody = req.rawBody.toString('utf8')
    } else if (typeof req.body === 'string') {
      rawBody = req.body
    } else if (req.body && typeof req.body === 'object') {
      // Last resort: stringify body. Warning: key order might differ from payload.
      // Verification might fail if not exact match.
      rawBody = JSON.stringify(req.body)
    }

    if (rawBody === undefined) {
      reply
        .code(400)
        .send('Missing raw request body for Paystack webhook verification')
      return
    }

    const signature = getHeader(req.headers, headerName)
    const valid = await verifyPaystackSignature({
      payload: rawBody,
      signature,
      secretKey: options.secretKey,
    })

    if (!valid) {
      reply.code(401).send('Invalid Paystack signature')
      return
    }

    try {
      req.paystackEvent =
        typeof req.body === 'object'
          ? (req.body as WebhookEvent<unknown>)
          : JSON.parse(rawBody)
    } catch {
      // If parsing fails, leave paystackEvent undefined
      req.paystackEvent = undefined
    }
  }
}
