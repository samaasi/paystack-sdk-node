import type { StatusSummaryResponse } from "./status.types"

export interface StatusResourceOptions {
  fetchImpl?: (input: string, init?: RequestInit) => Promise<any>
  baseUrl?: string
}

export class StatusResource {
  private readonly fetchImpl: (input: string, init?: RequestInit) => Promise<any>
  private readonly baseUrl: string

  constructor(options: StatusResourceOptions = {}) {
    const globalFetch: typeof fetch | undefined = (globalThis as any).fetch
    const impl = options.fetchImpl ?? globalFetch

    if (!impl) {
      throw new Error("A fetch implementation is required to use StatusResource")
    }

    this.fetchImpl = impl
    this.baseUrl = options.baseUrl ?? "https://status.paystack.com"
  }

  async check(): Promise<StatusSummaryResponse> {
    const trimmedBase = this.baseUrl.replace(/\/$/, "")
    const url = `${trimmedBase}/api/v2/summary.json`
    const response = await this.fetchImpl(url, {
      method: "GET",
    })

    if (!response || typeof (response as any).json !== "function") {
      throw new Error("Invalid response from Paystack status endpoint")
    }

    return (await (response as any).json()) as StatusSummaryResponse
  }
}

