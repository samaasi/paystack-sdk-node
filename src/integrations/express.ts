import { verifyPaystackSignature } from '../webhooks/verifier'
import type { PaystackEvent } from '../enums/events'
import type { WebhookEvent } from '../resources/webhooks/webhooks.types'

export interface ExpressWebhookOptions {
  /** Your Paystack secret key used to verify webhook signatures */
  secretKey: string
  /** The header name to check for the signature (default: 'x-paystack-signature') */
  headerName?: string
}

export interface ExpressLikeRequest {
  rawBody?: string | Uint8Array
  body?: unknown
  headers?: Record<string, unknown>
  paystackEvent?: WebhookEvent<unknown>
  [key: string]: unknown
}

export interface ExpressLikeResponse {
  status(code: number): ExpressLikeResponse
  send(body: string): void
}

export type NextFunction = (err?: unknown) => void

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

function getRawBody(req: ExpressLikeRequest): string | undefined {
  const raw = req.rawBody

  if (typeof raw === 'string') {
    return raw
  }

  if (raw instanceof Uint8Array) {
    return Buffer.from(raw).toString('utf8')
  }

  if (typeof req.body === 'string') {
    return req.body
  }

  return undefined
}

/**
 * Creates an Express middleware for verifying Paystack webhook signatures.
 *
 * **Important**: To use this middleware, you must configure your Express app to parse
 * the raw request body. You can do this using `express.json({ verify: (req, res, buf) => { req.rawBody = buf } })`
 * or a similar approach.
 *
 * @param options - Configuration options for the middleware
 * @returns An Express middleware function that verifies webhook signatures
 *
 * @example
 * ```typescript
 * import express from 'express'
 * import { createPaystackExpressMiddleware } from 'paystack-sdk-node/express'
 * import type { PaystackEvent, WebhookEvent } from 'paystack-sdk-node'
 *
 * const app = express()
 *
 * // Configure Express to parse raw body
 * app.use(express.json({
 *   verify: (req, res, buf) => {
 *     req.rawBody = buf
 *   }
 * }))
 *
 * // Add Paystack webhook middleware
 * app.use('/paystack/webhook', createPaystackExpressMiddleware({
 *   secretKey: 'sk_test_your_secret_key'
 * }))
 *
 * // Handle webhook events
 * app.post('/paystack/webhook', (req, res) => {
 *   const event = req.paystackEvent as WebhookEvent
 *
 *   switch (event.event) {
 *     case PaystackEvent.ChargeSuccess:
 *       // Handle successful charge
 *       console.log('Charge successful!', event.data)
 *       break
 *     case PaystackEvent.TransferSuccess:
 *       // Handle successful transfer
 *       console.log('Transfer successful!', event.data)
 *       break
 *   }
 *
 *   res.status(200).send('OK')
 * })
 *
 * app.listen(3000)
 * ```
 */
export function createPaystackExpressMiddleware(
  options: ExpressWebhookOptions,
) {
  const headerName = (
    options.headerName ?? 'x-paystack-signature'
  ).toLowerCase()

  return async function paystackWebhookMiddleware(
    req: ExpressLikeRequest,
    res: ExpressLikeResponse,
    next: NextFunction,
  ) {
    const rawBody = getRawBody(req)

    if (rawBody === undefined) {
      res
        .status(400)
        .send('Missing raw request body for Paystack webhook verification')
      return
    }

    const signature = getHeader(req.headers ?? {}, headerName)
    const valid = await verifyPaystackSignature({
      payload: rawBody,
      signature,
      secretKey: options.secretKey,
    })

    if (!valid) {
      res.status(401).send('Invalid Paystack signature')
      return
    }

    try {
      req.paystackEvent =
        req.body && typeof req.body === 'object'
          ? (req.body as WebhookEvent<unknown>)
          : JSON.parse(rawBody)
    } catch {
      // If parsing fails, leave paystackEvent undefined
      req.paystackEvent = undefined
    }

    next()
  }
}
