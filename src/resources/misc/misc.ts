import type {
  ListBanksQuery,
  ListBanksResponse,
  ListCountriesResponse,
  ListStatesResponse,
  ResolveAccountLookupRequest,
  ResolveAccountLookupResponse,
  ResolveCardBinResponse,
} from './misc.types'
import { BaseResource } from '../base'
import { stringifyQuery } from '../../utils/qs'

export class MiscResource extends BaseResource {
  private readonly bankBasePath = '/bank'
  private readonly countryBasePath = '/country'
  private readonly addressVerificationBasePath = '/address_verification'
  private readonly decisionBasePath = '/decision'

  /**
   * List banks.
   *
   * @param query - The query parameters for filtering
   * @returns A promise resolving to the list of banks
   * @see https://paystack.com/docs/api/misc/#list-banks
   */
  listBanks(query: ListBanksQuery = {}): Promise<ListBanksResponse> {
    const qs = stringifyQuery(query)
    const path = qs ? `${this.bankBasePath}?${qs}` : this.bankBasePath

    return this.executor.execute<ListBanksResponse>(path, {
      method: 'GET',
    })
  }

  /**
   * List countries.
   *
   * @returns A promise resolving to the list of countries
   * @see https://paystack.com/docs/api/misc/#list-countries
   */
  listCountries(): Promise<ListCountriesResponse> {
    return this.executor.execute<ListCountriesResponse>(this.countryBasePath, {
      method: 'GET',
    })
  }

  /**
   * List states for a country.
   *
   * @param country - The country code (e.g. "NG", "GH")
   * @returns A promise resolving to the list of states
   * @see https://paystack.com/docs/api/misc/#list-states
   */
  listStates(country: string): Promise<ListStatesResponse> {
    const qs = stringifyQuery({ country })
    const path = `${this.addressVerificationBasePath}/states?${qs}`

    return this.executor.execute<ListStatesResponse>(path, {
      method: 'GET',
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
      method: 'GET',
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
    const qs = stringifyQuery(params)
    const path = `${this.bankBasePath}/resolve?${qs}`

    return this.executor.execute<ResolveAccountLookupResponse>(path, {
      method: 'GET',
    })
  }
}
