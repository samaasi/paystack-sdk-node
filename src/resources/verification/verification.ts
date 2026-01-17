import { BaseResource } from "../base"
import type {
  MatchBvnRequest,
  MatchBvnResponse,
  ResolveAccountRequest,
  ResolveAccountResponse,
  ResolveBvnResponse,
} from "./verification.types"

export class VerificationResource extends BaseResource {
  private readonly bankBasePath = "/bank"

  resolveAccount(
    params: ResolveAccountRequest,
  ): Promise<ResolveAccountResponse> {
    const search = new URLSearchParams()
    search.set("account_number", params.account_number)
    search.set("bank_code", params.bank_code)

    const path = `${this.bankBasePath}/resolve?${search.toString()}`

    return this.executor.execute<ResolveAccountResponse>(path, {
      method: "GET",
    })
  }

  resolveBvn(bvn: string): Promise<ResolveBvnResponse> {
    const path = `${this.bankBasePath}/resolve_bvn/${encodeURIComponent(bvn)}`

    return this.executor.execute<ResolveBvnResponse>(path, {
      method: "GET",
    })
  }

  matchBvn(params: MatchBvnRequest): Promise<MatchBvnResponse> {
    const search = new URLSearchParams()
    search.set("account_number", params.account_number)
    search.set("bank_code", params.bank_code)
    search.set("bvn", params.bvn)

    const path = `${this.bankBasePath}/match_bvn?${search.toString()}`

    return this.executor.execute<MatchBvnResponse>(path, {
      method: "GET",
    })
  }
}
