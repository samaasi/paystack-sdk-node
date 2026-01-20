import { verifyPaystackSignature } from "../webhooks/verifier"

export interface FastifyWebhookOptions {
  secretKey: string
  headerName?: string
}

// Structural typing for Fastify Request to avoid hard dependency
export interface FastifyLikeRequest {
  body: unknown
  headers: Record<string, unknown>
  rawBody?: string | Buffer
  paystackEvent?: unknown
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
 * Usage:
 * fastify.addHook("preValidation", createPaystackFastifyHook({ secretKey: "..." }))
 */
export function createPaystackFastifyHook(options: FastifyWebhookOptions) {
  const headerName = (options.headerName ?? "x-paystack-signature").toLowerCase()

  return async function paystackWebhookHook(
    req: FastifyLikeRequest,
    reply: FastifyLikeReply,
  ) {
    // In Fastify, raw body handling often requires specific configuration.
    // We assume the user has configured Fastify to keep the raw body,
    // or we try to reconstruct it if it's simple.
    // Ideally, users should use 'fastify-raw-body' plugin.

    let rawBody: string | undefined

    if (typeof req.rawBody === "string") {
      rawBody = req.rawBody
    } else if (req.rawBody instanceof Buffer) {
      rawBody = req.rawBody.toString("utf8")
    } else if (typeof req.body === "string") {
      rawBody = req.body
    } else if (req.body && typeof req.body === "object") {
      // Last resort: stringify body. Warning: key order might differ from payload.
      // Verification might fail if not exact match.
      rawBody = JSON.stringify(req.body)
    }

    if (rawBody === undefined) {
      reply.code(400).send("Missing raw request body for Paystack webhook verification")
      throw new Error("Missing raw request body")
    }

    const signature = getHeader(req.headers, headerName)
    const valid = await verifyPaystackSignature({
      payload: rawBody,
      signature,
      secretKey: options.secretKey,
    })

    if (!valid) {
      reply.code(401).send("Invalid Paystack signature")
      throw new Error("Invalid Paystack signature")
    }

    try {
      req.paystackEvent =
        typeof req.body === "object" ? req.body : JSON.parse(rawBody)
    } catch {
      req.paystackEvent = req.body ?? rawBody
    }
  }
}
