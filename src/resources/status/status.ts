import type { StatusSummaryResponse } from './status.types'
import type { FetchImpl, RequestInitLike } from '../../core/api-client'

export interface StatusResourceOptions {
  fetchImpl?: FetchImpl
  baseUrl?: string
}

export class StatusResource {
  private readonly fetchImpl: FetchImpl
  private readonly baseUrl: string

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
  }

  /**
   * Check Paystack API status.
   *
   * @returns A promise resolving to the status summary
   * @see https://status.paystack.com/
   */
  async check(): Promise<StatusSummaryResponse> {
    const trimmedBase = this.baseUrl.replace(/\/$/, '')
    const url = `${trimmedBase}/api/v2/summary.json`
    const response = await this.fetchImpl(url, {
      method: 'GET',
    } satisfies RequestInitLike)

    if (!response || typeof response.json !== 'function') {
      throw new Error('Invalid response from Paystack status endpoint')
    }

    return (await response.json()) as StatusSummaryResponse
  }
}
