import {
  PaystackError,
  mapNetworkError,
  mapPaystackHttpError,
  type PaystackErrorResponse,
} from './error-handler'
import { executeWithRetry, type RetryOptions } from './retry-strategy'

export interface Logger {
  debug: (message: string, data?: Record<string, unknown>) => void
  info: (message: string, data?: Record<string, unknown>) => void
  warn: (message: string, data?: Record<string, unknown>) => void
  error: (message: string, data?: Record<string, unknown>) => void
}

export interface ApiClientOptions {
  apiKey: string
  baseUrl?: string
  fetchImpl?: (input: string, init?: RequestInit) => Promise<Response>
  retry?: RetryOptions
  logger?: Logger
}

export class ApiClient {
  private apiKey: string
  private baseUrl: string
  private fetchImpl?: (input: string, init?: RequestInit) => Promise<Response>
  private retryOptions?: RetryOptions
  private logger?: Logger

  constructor(options: ApiClientOptions) {
    this.apiKey = options.apiKey
    this.baseUrl = options.baseUrl ?? 'https://api.paystack.co'
    this.fetchImpl = options.fetchImpl
    this.retryOptions = options.retry
    this.logger = options.logger
  }

  private getFetch() {
    const impl = this.fetchImpl ?? fetch
    return impl
  }

  async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${path}`
    const fetchFn = this.getFetch()

    const operation = async () => {
      this.logger?.debug('Making API request', {
        method: init.method || 'GET',
        url,
        path,
      })

      try {
        const extraHeaders =
          init.headers &&
          !(init.headers instanceof Headers) &&
          !Array.isArray(init.headers)
            ? init.headers
            : undefined

        const response = await fetchFn(url, {
          ...init,
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            ...(extraHeaders ?? {}),
          },
        } as RequestInit)

        this.logger?.debug('Received API response', {
          method: init.method || 'GET',
          url,
          status: response.status,
        })

        if (!response.ok) {
          const status = response.status
          let body: unknown

          try {
            body = await response.json()
          } catch {
            body = undefined
          }

          const error = mapPaystackHttpError(
            status,
            body as PaystackErrorResponse | null | undefined,
          )

          this.logger?.error('API request failed', {
            method: init.method || 'GET',
            url,
            status,
            error,
          })

          throw error
        }

        const data = await response.json()
        this.logger?.debug('API request successful', {
          method: init.method || 'GET',
          url,
        })
        return data as T
      } catch (error) {
        if (error instanceof PaystackError) {
          throw error
        }

        const networkError = mapNetworkError(error)
        this.logger?.error('Network error occurred', {
          method: init.method || 'GET',
          url,
          error: networkError,
        })
        throw networkError
      }
    }

    const shouldRetry = (error: unknown) => {
      if (!(error instanceof PaystackError)) {
        return false
      }

      const status = error.status
      const should = status === 502 || status === 503 || status === 504

      if (should) {
        this.logger?.warn('Retrying failed API request', {
          method: init.method || 'GET',
          url,
          status,
        })
      }

      return should
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
