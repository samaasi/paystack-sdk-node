import { BaseResource } from '../base'
import type {
  MatchBvnRequest,
  MatchBvnResponse,
  ResolveAccountRequest,
  ResolveAccountResponse,
  ResolveBvnResponse,
} from './verification.types'

/**
 * Verification resource
 * @see https://paystack.com/docs/api/verification/
 */
export class VerificationResource extends BaseResource {
  private readonly bankBasePath = '/bank'

  /**
   * Resolve an account number
   * @param params - The account number and bank code
   * @returns A promise resolving to the account details
   * @see https://paystack.com/docs/api/verification/#resolve-account
   */
  resolveAccount(
    params: ResolveAccountRequest,
  ): Promise<ResolveAccountResponse> {
    const search = new URLSearchParams()
    search.set('account_number', params.account_number)
    search.set('bank_code', params.bank_code)

    const path = `${this.bankBasePath}/resolve?${search.toString()}`

    return this.executor.execute<ResolveAccountResponse>(path, {
      method: 'GET',
    })
  }

  /**
   * Resolve a BVN
   * @param bvn - The BVN to resolve
   * @returns A promise resolving to the BVN details
   * @see https://paystack.com/docs/api/verification/#resolve-bvn
   */
  resolveBvn(bvn: string): Promise<ResolveBvnResponse> {
    const path = `${this.bankBasePath}/resolve_bvn/${encodeURIComponent(bvn)}`

    return this.executor.execute<ResolveBvnResponse>(path, {
      method: 'GET',
    })
  }

  /**
   * Match a BVN
   * @param params - The account number, bank code, and BVN
   * @returns A promise resolving to the match result
   * @see https://paystack.com/docs/api/verification/#match-bvn
   */
  matchBvn(params: MatchBvnRequest): Promise<MatchBvnResponse> {
    const search = new URLSearchParams()
    search.set('account_number', params.account_number)
    search.set('bank_code', params.bank_code)
    search.set('bvn', params.bvn)

    const path = `${this.bankBasePath}/match_bvn?${search.toString()}`

    return this.executor.execute<MatchBvnResponse>(path, {
      method: 'GET',
    })
  }
}
