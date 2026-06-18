import type {
  Settlement,
  ListSettlementsQuery,
  ListSettlementsApiResponse,
  ListSettlementTransactionsQuery,
  ListSettlementTransactionsApiResponse,
} from './settlements.types'
import { BaseResource } from '../base'
import { stringifyQuery } from '../../utils/qs'
import { AutoPaginator } from '../../utils/pagination'

export class SettlementsResource extends BaseResource {
  private readonly basePath = '/settlement'

  /**
   * List settlements made to your integration.
   *
   * @param query - The query parameters for filtering
   * @returns A promise resolving to the list of settlements
   * @see https://paystack.com/docs/api/settlement/#list
   */
  list(query: ListSettlementsQuery = {}): Promise<ListSettlementsApiResponse> {
    const qs = stringifyQuery(query)
    const path = qs ? `${this.basePath}?${qs}` : this.basePath

    return this.executor.execute<ListSettlementsApiResponse>(path, {
      method: 'GET',
    })
  }

  listAll(query: ListSettlementsQuery = {}): AutoPaginator<Settlement, ListSettlementsQuery> {
    return new AutoPaginator({ fetchPage: (q) => this.list(q), initialQuery: query })
  }

  /**
   * List settlement transactions.
   *
   * @param settlementId - The settlement ID
   * @param query - The query parameters for filtering
   * @returns A promise resolving to the list of transactions in the settlement
   * @see https://paystack.com/docs/api/settlement/#transactions
   */
  listTransactions(
    settlementId: number | string,
    query: ListSettlementTransactionsQuery = {},
  ): Promise<ListSettlementTransactionsApiResponse> {
    const id = String(settlementId)
    const qs = stringifyQuery(query)
    const base = `${this.basePath}/${encodeURIComponent(id)}/transactions`
    const path = qs ? `${base}?${qs}` : base

    return this.executor.execute<ListSettlementTransactionsApiResponse>(path, {
      method: 'GET',
    })
  }
}
