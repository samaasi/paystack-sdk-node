import { verifyPaystackSignature } from '../webhooks/verifier'

export interface ExpressWebhookOptions {
  secretKey: string
  headerName?: string
}

export interface ExpressLikeRequest {
  rawBody?: string | Uint8Array
  body?: unknown
  headers?: Record<string, unknown>
  paystackEvent?: unknown
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

  if (req.body && typeof req.body === 'object') {
    return JSON.stringify(req.body)
  }

  return undefined
}

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
          ? req.body
          : JSON.parse(rawBody)
    } catch {
      req.paystackEvent = req.body ?? rawBody
    }

    next()
  }
}
