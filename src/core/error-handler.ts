export interface PaystackErrorContext {
  status?: number
  code?: string
  raw?: unknown
}

export class PaystackError extends Error {
  readonly status?: number
  readonly code?: string
  readonly raw?: unknown

  constructor(message: string, context: PaystackErrorContext = {}) {
    super(message)
    this.name = new.target.name
    this.status = context.status
    this.code = context.code
    this.raw = context.raw
  }
}

export class PaystackAuthenticationError extends PaystackError {}

export class PaystackRateLimitError extends PaystackError {}

export class PaystackValidationError extends PaystackError {}

export class PaystackServerError extends PaystackError {}

export class PaystackAPIError extends PaystackError {}

export class PaystackNetworkError extends PaystackError {}

export interface PaystackErrorResponse {
  status?: number
  message?: string
  code?: string
  [key: string]: unknown
}

export function mapPaystackHttpError(
  httpStatus: number,
  body: PaystackErrorResponse | null | undefined,
): PaystackError {
  const message = body?.message || `Paystack request failed with status ${httpStatus}`
  const code = (body?.code as string | undefined) ?? undefined
  const context: PaystackErrorContext = { status: httpStatus, code, raw: body }

  if (httpStatus === 401 || httpStatus === 403) {
    return new PaystackAuthenticationError(message, context)
  }

  if (httpStatus === 429) {
    return new PaystackRateLimitError(message, context)
  }

  if (httpStatus >= 500 && httpStatus <= 599) {
    return new PaystackServerError(message, context)
  }

  if (httpStatus >= 400 && httpStatus < 500) {
    return new PaystackValidationError(message, context)
  }

  return new PaystackAPIError(message, context)
}

export function mapNetworkError(error: unknown): PaystackNetworkError {
  const message =
    error instanceof Error ? error.message : "Network error while communicating with Paystack"

  return new PaystackNetworkError(message, { raw: error })
}
