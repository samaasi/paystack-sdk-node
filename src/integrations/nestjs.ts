import { verifyPaystackSignature } from '../webhooks/verifier'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import type { CanActivate, ExecutionContext } from '@nestjs/common'
import type { WebhookEvent } from '../resources/webhooks/webhooks.types'

export interface NestPaystackWebhookOptions {
  /** Your Paystack secret key used to verify webhook signatures */
  secretKey: string
  /** The header name to check for the signature (default: 'x-paystack-signature') */
  headerName?: string
}

export interface NestHttpRequest {
  rawBody?: string | Uint8Array
  body?: unknown
  headers?: Record<string, unknown>
  paystackEvent?: WebhookEvent<unknown>
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

/**
 * A NestJS guard for verifying Paystack webhook signatures.
 *
 * **Important**: To use this guard, you must configure your NestJS app to parse
 * the raw request body. You can do this by setting `rawBody: true` in your
 * NestJS application options or using a middleware that preserves the raw body.
 *
 * @example
 * ```typescript
 * import { Controller, Post, UseGuards, Req } from '@nestjs/common'
 * import { PaystackWebhookGuard } from 'paystack-sdk-node/nestjs'
 * import type { PaystackEvent, WebhookEvent } from 'paystack-sdk-node'
 *
 * @Controller('paystack')
 * export class PaystackController {
 *   @Post('webhook')
 *   @UseGuards(new PaystackWebhookGuard({ secretKey: 'sk_test_your_secret_key' }))
 *   handleWebhook(@Req() req) {
 *     const event = req.paystackEvent as WebhookEvent
 *
 *     switch (event.event) {
 *       case PaystackEvent.ChargeSuccess:
 *         // Handle successful charge
 *         console.log('Charge successful!', event.data)
 *         break
 *     }
 *
 *     return { status: 'ok' }
 *   }
 * }
 * ```
 */
@Injectable()
export class PaystackWebhookGuard implements CanActivate {
  private readonly secretKey: string
  private readonly headerName: string

  constructor(options: NestPaystackWebhookOptions) {
    this.secretKey = options.secretKey
    this.headerName = (
      options.headerName ?? 'x-paystack-signature'
    ).toLowerCase()
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp()
    const req = http.getRequest<NestHttpRequest>()

    const rawBody = getRawBody(req)

    if (rawBody === undefined) {
      throw new UnauthorizedException(
        'Missing raw request body for Paystack webhook verification',
      )
    }

    const signature = getHeader(req.headers ?? {}, this.headerName)

    const valid = await verifyPaystackSignature({
      payload: rawBody,
      signature,
      secretKey: this.secretKey,
    })

    if (!valid) {
      throw new UnauthorizedException('Invalid Paystack signature')
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

    return true
  }
}
