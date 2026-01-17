import type {
  ListBanksQuery,
  ListBanksResponse,
  ListCountriesResponse,
  ListStatesResponse,
  ResolveAccountLookupRequest,
  ResolveAccountLookupResponse,
  ResolveCardBinResponse,
} from "./misc.types"
import { BaseResource } from "../base"

export class MiscResource extends BaseResource {
  private readonly bankBasePath = "/bank"
  private readonly countryBasePath = "/country"
  private readonly addressBasePath = "/address"
  private readonly decisionBasePath = "/decision"

  listBanks(query: ListBanksQuery = {}): Promise<ListBanksResponse> {
    const search = new URLSearchParams()

    if (query.country !== undefined) {
      search.set("country", query.country)
    }

    if (query.type !== undefined) {
      search.set("type", query.type)
    }

    const path =
      search.size > 0
        ? `${this.bankBasePath}?${search.toString()}`
        : this.bankBasePath

    return this.executor.execute<ListBanksResponse>(path, {
      method: "GET",
    })
  }

  listCountries(): Promise<ListCountriesResponse> {
    return this.executor.execute<ListCountriesResponse>(
      this.countryBasePath,
      {
        method: "GET",
      },
    )
  }

  listStates(): Promise<ListStatesResponse> {
    const path = `${this.addressBasePath}/pyramid/states`

    return this.executor.execute<ListStatesResponse>(path, {
      method: "GET",
    })
  }

  resolveCardBin(bin: string): Promise<ResolveCardBinResponse> {
    const path = `${this.decisionBasePath}/bin/${encodeURIComponent(bin)}`

    return this.executor.execute<ResolveCardBinResponse>(path, {
      method: "GET",
    })
  }

  resolveAccount(
    params: ResolveAccountLookupRequest,
  ): Promise<ResolveAccountLookupResponse> {
    const search = new URLSearchParams()
    search.set("account_number", params.account_number)
    search.set("bank_code", params.bank_code)

    const path = `${this.bankBasePath}/resolve?${search.toString()}`

    return this.executor.execute<ResolveAccountLookupResponse>(path, {
      method: "GET",
    })
  }
}
