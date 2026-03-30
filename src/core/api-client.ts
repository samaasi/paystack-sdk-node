import {
  PaystackError,
  mapNetworkError,
  mapPaystackHttpError,
  type PaystackErrorResponse,
} from './error-handler'
import { executeWithRetry, type RetryOptions } from './retry-strategy'

type FetchImpl = (input: string, init?: RequestInit) => Promise<Response>

function buildHeaders(
  apiKey: string,
  existing?: RequestInit['headers'],
): Headers {
  const headers = new Headers()
  headers.set('Authorization', `Bearer ${apiKey}`)
  headers.set('Content-Type', 'application/json')

  if (!existing) {
    return headers
  }

  const extras = new Headers(existing)

  for (const [key, value] of extras.entries()) {
    headers.set(key, value)
  }

  return headers
}

export interface ApiClientOptions {
  apiKey: string
  baseUrl?: string
  fetchImpl?: FetchImpl
  retry?: RetryOptions
}

export class ApiClient {
  private apiKey: string
  private baseUrl: string
  private fetchImpl?: FetchImpl
  private retryOptions?: RetryOptions

  constructor(options: ApiClientOptions) {
    this.apiKey = options.apiKey
    this.baseUrl = options.baseUrl ?? 'https://api.paystack.co'
    this.fetchImpl = options.fetchImpl
    this.retryOptions = options.retry
  }

  private getFetch(): FetchImpl {
    const globalFetch: typeof fetch | undefined = (
      globalThis as { fetch?: typeof fetch }
    ).fetch
    const impl = this.fetchImpl ?? globalFetch

    if (!impl) {
      throw new Error('A fetch implementation is required to use ApiClient')
    }

    return impl
  }

  async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${path}`
    const fetchFn = this.getFetch()

    const operation = async () => {
      try {
        const headers = buildHeaders(this.apiKey, init.headers)

        const response = await fetchFn(url, {
          ...init,
          headers,
        } as RequestInit)

        if (!response.ok) {
          const status = response.status
          let body: unknown

          try {
            body = await response.json()
          } catch {
            body = undefined
          }

          throw mapPaystackHttpError(
            status,
            body as PaystackErrorResponse | null | undefined,
          )
        }

        const data = await response.json()
        return data as T
      } catch (error) {
        if (error instanceof PaystackError) {
          throw error
        }

        throw mapNetworkError(error)
      }
    }

    const shouldRetry = (error: unknown) => {
      if (!(error instanceof PaystackError)) {
        return false
      }

      const status = error.status
      return status === 502 || status === 503 || status === 504
    }

    return executeWithRetry(operation, shouldRetry, this.retryOptions)
  }

  async get<T>(path: string, init: RequestInit = {}): Promise<T> {
    return this.request<T>(path, { ...init, method: 'GET' })
  }

  async post<T, B = unknown>(
    path: string,
    body?: B,
    init: RequestInit = {},
  ): Promise<T> {
    const finalInit: RequestInit =
      body === undefined
        ? { ...init, method: 'POST' }
        : { ...init, method: 'POST', body: JSON.stringify(body) }

    return this.request<T>(path, finalInit)
  }

  async put<T, B = unknown>(
    path: string,
    body?: B,
    init: RequestInit = {},
  ): Promise<T> {
    const finalInit: RequestInit =
      body === undefined
        ? { ...init, method: 'PUT' }
        : { ...init, method: 'PUT', body: JSON.stringify(body) }

    return this.request<T>(path, finalInit)
  }

  async delete<T>(path: string, init: RequestInit = {}): Promise<T> {
    return this.request<T>(path, { ...init, method: 'DELETE' })
  }
}
