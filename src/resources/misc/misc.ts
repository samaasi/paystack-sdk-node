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

  /**
   * List banks.
   *
   * @param query - The query parameters for filtering
   * @returns A promise resolving to the list of banks
   * @see https://paystack.com/docs/api/misc/#list-banks
   */
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

  /**
   * List countries.
   *
   * @returns A promise resolving to the list of countries
   * @see https://paystack.com/docs/api/misc/#list-countries
   */
  listCountries(): Promise<ListCountriesResponse> {
    return this.executor.execute<ListCountriesResponse>(
      this.countryBasePath,
      {
        method: "GET",
      },
    )
  }

  /**
   * List states.
   *
   * @returns A promise resolving to the list of states
   * @see https://paystack.com/docs/api/misc/#list-states
   */
  listStates(): Promise<ListStatesResponse> {
    const path = `${this.addressBasePath}/pyramid/states`

    return this.executor.execute<ListStatesResponse>(path, {
      method: "GET",
    })
  }

  /**
   * Resolve a card BIN.
   *
   * @param bin - The card BIN
   * @returns A promise resolving to the BIN details
   * @see https://paystack.com/docs/api/misc/#resolve-card-bin
   */
  resolveCardBin(bin: string): Promise<ResolveCardBinResponse> {
    const path = `${this.decisionBasePath}/bin/${encodeURIComponent(bin)}`

    return this.executor.execute<ResolveCardBinResponse>(path, {
      method: "GET",
    })
  }

  /**
   * Resolve an account number.
   *
   * @param params - The account resolution parameters (account number, bank code)
   * @returns A promise resolving to the account details
   * @see https://paystack.com/docs/api/misc/#resolve-account-number
   */
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
