import {
  PaystackError,
  mapNetworkError,
  mapPaystackHttpError,
  type PaystackErrorResponse,
} from './error-handler'
import { executeWithRetry, type RetryOptions } from './retry-strategy'

export type HeadersInit =
  | Record<string, string>
  | Array<[string, string]>

export interface RequestInitLike {
  method?: string
  headers?: HeadersInit
  body?: string | Uint8Array | ArrayBuffer | null
  signal?: AbortSignal | null
  timeoutMs?: number
  [key: string]: unknown
}

export interface ResponseLike {
  ok: boolean
  status: number
  json(): Promise<unknown>
}

export type FetchImpl = (
  input: string,
  init?: RequestInitLike,
) => Promise<ResponseLike>

function isForEachHeaders(
  value: unknown,
): value is { forEach: (cb: (value: string, key: string) => void) => void } {
  if (!value || typeof value !== 'object') {
    return false
  }

  const record = value as Record<string, unknown>
  return typeof record.forEach === 'function'
}

function normalizeHeaderPairs(
  existing?: unknown,
): Array<[string, string]> {
  if (!existing) {
    return []
  }

  if (Array.isArray(existing)) {
    return existing
      .map(([key, value]) => [String(key), String(value)] as [string, string])
      .filter(([key]) => key.length > 0)
  }

  if (isForEachHeaders(existing)) {
    const pairs: Array<[string, string]> = []
    existing.forEach((value, key) => {
      if (!key) {
        return
      }

      pairs.push([key, String(value)])
    })
    return pairs
  }

  const pairs: Array<[string, string]> = []
  for (const [key, value] of Object.entries(
    existing as Record<string, unknown>,
  )) {
    if (value === undefined) {
      continue
    }

    pairs.push([key, String(value)])
  }

  return pairs
}

function buildHeaders(apiKey: string, existing?: unknown) {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  }

  for (const [key, value] of normalizeHeaderPairs(existing)) {
    headers[key] = value
  }

  return headers
}

export interface ApiClientOptions {
  apiKey: string
  baseUrl?: string
  fetchImpl?: FetchImpl
  retry?: RetryOptions
  timeoutMs?: number
}

export class ApiClient {
  private apiKey: string
  private baseUrl: string
  private fetchImpl?: FetchImpl
  private retryOptions?: RetryOptions
  private timeoutMs?: number

  constructor(options: ApiClientOptions) {
    this.apiKey = options.apiKey
    this.baseUrl = options.baseUrl ?? 'https://api.paystack.co'
    this.fetchImpl = options.fetchImpl
    this.retryOptions = options.retry
    this.timeoutMs = options.timeoutMs
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

  async request<T>(path: string, init: RequestInitLike = {}): Promise<T> {
    const url = `${this.baseUrl}${path}`
    const fetchFn = this.getFetch()
    const timeoutMs =
      typeof init.timeoutMs === 'number' ? init.timeoutMs : this.timeoutMs
    const externalSignal = init.signal ?? undefined

    let timeoutId: ReturnType<typeof setTimeout> | undefined
    let timeoutController: AbortController | undefined
    let linkedAbortHandler: (() => void) | undefined
    let requestSignal: AbortSignal | undefined

    if (timeoutMs !== undefined && timeoutMs > 0) {
      timeoutController = new AbortController()
      requestSignal = timeoutController.signal

      if (externalSignal) {
        if (externalSignal.aborted) {
          timeoutController.abort()
        } else {
          linkedAbortHandler = () => {
            timeoutController?.abort()
          }
          externalSignal.addEventListener('abort', linkedAbortHandler, {
            once: true,
          })
        }
      }

      timeoutId = setTimeout(() => {
        timeoutController?.abort()
      }, timeoutMs)
    } else {
      requestSignal = externalSignal
    }

    const { timeoutMs: _timeout, signal: _signal, headers: _headers, ...rest } =
      init
    const baseInit: RequestInitLike = {
      ...rest,
      signal: requestSignal,
    }

    const operation = async () => {
      try {
        const headers = buildHeaders(this.apiKey, _headers)
        const requestInit = { ...baseInit, headers }

        const signal = requestInit.signal ?? undefined

        if (signal?.aborted) {
          throw new Error('Request aborted')
        }

        const fetchPromise = fetchFn(url, requestInit)
        let abortCleanup: (() => void) | undefined
        const race: Array<Promise<ResponseLike>> = [fetchPromise]

        if (signal) {
          race.push(
            new Promise<ResponseLike>((_, reject) => {
              const onAbort = () => {
                fetchPromise.catch(() => {})
                reject(new Error('Request aborted'))
              }

              signal.addEventListener('abort', onAbort, { once: true })
              abortCleanup = () => {
                signal.removeEventListener('abort', onAbort)
              }
            }),
          )
        }

        let response: ResponseLike

        try {
          response = await Promise.race(race)
        } catch (error) {
          if (
            error instanceof Error &&
            error.message === 'Request aborted' &&
            timeoutController?.signal.aborted &&
            !externalSignal?.aborted
          ) {
            throw new Error('Request timed out')
          }

          throw error
        } finally {
          abortCleanup?.()
        }

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

    try {
      return await executeWithRetry(operation, shouldRetry, this.retryOptions)
    } finally {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId)
      }

      if (externalSignal && linkedAbortHandler) {
        externalSignal.removeEventListener('abort', linkedAbortHandler)
      }
    }
  }

  async get<T>(path: string, init: RequestInitLike = {}): Promise<T> {
    return this.request<T>(path, { ...init, method: 'GET' })
  }

  async post<T, B = unknown>(
    path: string,
    body?: B,
    init: RequestInitLike = {},
  ): Promise<T> {
    const finalInit: RequestInitLike =
      body === undefined
        ? { ...init, method: 'POST' }
        : { ...init, method: 'POST', body: JSON.stringify(body) }

    return this.request<T>(path, finalInit)
  }

  async put<T, B = unknown>(
    path: string,
    body?: B,
    init: RequestInitLike = {},
  ): Promise<T> {
    const finalInit: RequestInitLike =
      body === undefined
        ? { ...init, method: 'PUT' }
        : { ...init, method: 'PUT', body: JSON.stringify(body) }

    return this.request<T>(path, finalInit)
  }

  async delete<T, B = unknown>(
    path: string,
    body?: B,
    init: RequestInitLike = {},
  ): Promise<T> {
    const finalInit: RequestInitLike =
      body === undefined
        ? { ...init, method: 'DELETE' }
        : { ...init, method: 'DELETE', body: JSON.stringify(body) }

    return this.request<T>(path, finalInit)
  }
}
