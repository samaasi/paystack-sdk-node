import type { StatusSummaryResponse } from "./status.types"

export interface StatusResourceOptions {
  fetchImpl?: (input: string, init?: RequestInit) => Promise<Response>
  baseUrl?: string
}

export class StatusResource {
  private readonly fetchImpl: (input: string, init?: RequestInit) => Promise<Response>
  private readonly baseUrl: string

  constructor(options: StatusResourceOptions = {}) {
    const globalFetch: typeof fetch | undefined = (globalThis as { fetch?: typeof fetch }).fetch
    const impl = options.fetchImpl ?? globalFetch

    if (!impl) {
      throw new Error("A fetch implementation is required to use StatusResource")
    }

    this.fetchImpl = impl
    this.baseUrl = options.baseUrl ?? "https://status.paystack.com"
  }

  /**
   * Check Paystack API status.
   *
   * @returns A promise resolving to the status summary
   * @see https://status.paystack.com/
   */
  async check(): Promise<StatusSummaryResponse> {
    const trimmedBase = this.baseUrl.replace(/\/$/, "")
    const url = `${trimmedBase}/api/v2/summary.json`
    const response = await this.fetchImpl(url, {
      method: "GET",
    })

    if (!response || typeof response.json !== "function") {
      throw new Error("Invalid response from Paystack status endpoint")
    }

    return (await response.json()) as StatusSummaryResponse
  }
}
