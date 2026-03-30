import type { StatusSummaryResponse } from './status.types'
import type { FetchImpl, RequestInitLike, ResponseLike } from '../../core/api-client'

export interface StatusResourceOptions {
  fetchImpl?: FetchImpl
  baseUrl?: string
  timeoutMs?: number
}

export class StatusResource {
  private readonly fetchImpl: FetchImpl
  private readonly baseUrl: string
  private readonly timeoutMs?: number

  constructor(options: StatusResourceOptions = {}) {
    const globalFetch: typeof fetch | undefined = (
      globalThis as { fetch?: typeof fetch }
    ).fetch
    const impl = options.fetchImpl ?? globalFetch

    if (!impl) {
      throw new Error(
        'A fetch implementation is required to use StatusResource',
      )
    }

    this.fetchImpl = impl
    this.baseUrl = options.baseUrl ?? 'https://status.paystack.com'
    this.timeoutMs = options.timeoutMs
  }

  /**
   * Check Paystack API status.
   *
   * @returns A promise resolving to the status summary
   * @see https://status.paystack.com/
   */
  async check(
    options: { signal?: AbortSignal | null } = {},
  ): Promise<StatusSummaryResponse> {
    const trimmedBase = this.baseUrl.replace(/\/$/, '')
    const url = `${trimmedBase}/api/v2/summary.json`

    const externalSignal = options.signal ?? undefined
    const timeoutMs = this.timeoutMs
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

    const requestInit: RequestInitLike = {
      method: 'GET',
      signal: requestSignal,
    }

    let response: unknown

    try {
      const signal = requestInit.signal ?? undefined

      if (signal?.aborted) {
        throw new Error('Request aborted')
      }

      const fetchPromise = this.fetchImpl(url, requestInit)
      let abortCleanup: (() => void) | undefined
      const race: Array<Promise<unknown>> = [fetchPromise]

      if (signal) {
        race.push(
          new Promise<unknown>((_, reject) => {
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
    } finally {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId)
      }

      if (externalSignal && linkedAbortHandler) {
        externalSignal.removeEventListener('abort', linkedAbortHandler)
      }
    }

    if (!response || typeof (response as ResponseLike).json !== 'function') {
      throw new Error('Invalid response from Paystack status endpoint')
    }

    return (await (response as ResponseLike).json()) as StatusSummaryResponse
  }
}
