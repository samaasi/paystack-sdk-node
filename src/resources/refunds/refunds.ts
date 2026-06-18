import { stringifyQuery } from '../../utils/qs'
import { AutoPaginator, type PaginatorOptions } from '../../utils/pagination'
import type { Refund } from './refunds.types'
import type {
  ListRefundsQuery,
  RetryRefundRequest,
  CreateRefundRequest,
  GetRefundApiResponse,
  ListRefundsApiResponse,
  RetryRefundApiResponse,
  CreateRefundApiResponse,
} from './refunds.types'
import { BaseResource } from '../base'

export class RefundsResource extends BaseResource {
  private readonly basePath = '/refund'

  /**
   * Initiate a refund.
   *
   * @param payload - The refund creation details
   * @returns A promise resolving to the refund creation response
   * @see https://paystack.com/docs/api/refund/#create
   */
  create(payload: CreateRefundRequest): Promise<CreateRefundApiResponse> {
    return this.executor.post<CreateRefundApiResponse>(this.basePath, payload)
  }

  /**
   * List refunds available on your integration.
   *
   * @param query - Pagination and filtering options
   * @returns A promise resolving to the list of refunds
   * @see https://paystack.com/docs/api/refund/#list
   */
  list(query: ListRefundsQuery = {}): Promise<ListRefundsApiResponse> {
    const qs = stringifyQuery(query as Record<string, unknown>)
    const path = qs ? `${this.basePath}?${qs}` : this.basePath

    return this.executor.get<ListRefundsApiResponse>(path)
  }

  listAll(
    query: ListRefundsQuery = {},
  ): AutoPaginator<Refund, ListRefundsQuery> {
    return new AutoPaginator({
      fetchPage: (q) => this.list(q),
      initialQuery: query,
    })
  }

  /**
   * Fetch a refund details.
   *
   * @param idOrReference - The refund ID or reference
   * @returns A promise resolving to the refund details
   * @see https://paystack.com/docs/api/refund/#fetch
   */
  get(idOrReference: number | string): Promise<GetRefundApiResponse> {
    return this.executor.get<GetRefundApiResponse>(
      `${this.basePath}/${encodeURIComponent(String(idOrReference))}`,
    )
  }

  /**
   * Retry a refund.
   *
   * @param id - The refund ID
   * @param payload - The retry details
   * @returns A promise resolving to the retry response
   */
  retry(
    id: number | string,
    payload: RetryRefundRequest,
  ): Promise<RetryRefundApiResponse> {
    return this.executor.post<RetryRefundApiResponse>(
      `${this.basePath}/retry_with_customer_details/${encodeURIComponent(String(id))}`,
      payload,
    )
  }
}
