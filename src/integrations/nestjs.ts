import { verifyPaystackSignature } from "../webhooks/verifier"
import { Injectable, UnauthorizedException } from "@nestjs/common"
import type { CanActivate, ExecutionContext } from "@nestjs/common"

export interface NestPaystackWebhookOptions {
  secretKey: string
  headerName?: string
}

export interface NestHttpRequest {
  rawBody?: string | Uint8Array
  body?: unknown
  headers?: Record<string, unknown>
}

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

function getRawBody(req: NestHttpRequest): string | undefined {
  const raw = req.rawBody

  if (typeof raw === "string") {
    return raw
  }

  if (raw instanceof Uint8Array) {
    return Buffer.from(raw).toString("utf8")
  }

  if (typeof req.body === "string") {
    return req.body
  }

  if (req.body && typeof req.body === "object") {
    return JSON.stringify(req.body)
  }

  return undefined
}

@Injectable()
export class PaystackWebhookGuard implements CanActivate {
  private readonly secretKey: string
  private readonly headerName: string

  constructor(options: NestPaystackWebhookOptions) {
    this.secretKey = options.secretKey
    this.headerName = (options.headerName ?? "x-paystack-signature").toLowerCase()
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp()
    const req = http.getRequest<NestHttpRequest>()

    const rawBody = getRawBody(req)

    if (rawBody === undefined) {
      throw new UnauthorizedException(
        "Missing raw request body for Paystack webhook verification",
      )
    }

    const signature = getHeader(req.headers ?? {}, this.headerName)

    const valid = await verifyPaystackSignature({
      payload: rawBody,
      signature,
      secretKey: this.secretKey,
    })

    if (!valid) {
      throw new UnauthorizedException("Invalid Paystack signature")
    }

    return true
  }
}
