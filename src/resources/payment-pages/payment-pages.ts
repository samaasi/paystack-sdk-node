import { stringifyQuery } from '../../utils/qs'
import { AutoPaginator, type PaginatorOptions } from '../../utils/pagination'
import type { PaymentPage } from './payment-pages.types'
import type {
  CheckSlugRequest,
  CheckSlugApiResponse,
  ListPaymentPagesQuery,
  UpdatePaymentPageRequest,
  CreatePaymentPageRequest,
  GetPaymentPageApiResponse,
  ListPaymentPagesApiResponse,
} from './payment-pages.types'
import { BaseResource } from '../base'

export class PaymentPagesResource extends BaseResource {
  private readonly basePath = '/page'

  create(
    payload: CreatePaymentPageRequest,
  ): Promise<GetPaymentPageApiResponse> {
    return this.executor.post<GetPaymentPageApiResponse>(this.basePath, payload)
  }

  /**
   * List payment pages.
   *
   * @param query - The query parameters for filtering
   * @returns A promise resolving to the list of payment pages
   * @see https://paystack.com/docs/api/page/#list
   */
  list(
    query: ListPaymentPagesQuery = {},
  ): Promise<ListPaymentPagesApiResponse> {
    const qs = stringifyQuery(query as Record<string, unknown>)
    const path = qs ? `${this.basePath}?${qs}` : this.basePath

    return this.executor.get<ListPaymentPagesApiResponse>(path)
  }

  listAll(
    query: ListPaymentPagesQuery = {},
  ): AutoPaginator<PaymentPage, ListPaymentPagesQuery> {
    return new AutoPaginator({
      fetchPage: (q) => this.list(q),
      initialQuery: query,
    })
  }

  get(idOrSlug: string | number): Promise<GetPaymentPageApiResponse> {
    const path = `${this.basePath}/${encodeURIComponent(String(idOrSlug))}`

    return this.executor.get<GetPaymentPageApiResponse>(path)
  }

  /**
   * Update a payment page.
   *
   * @param idOrSlug - The payment page ID or slug
   * @param payload - The update payload
   * @returns A promise resolving to the updated payment page
   * @see https://paystack.com/docs/api/page/#update
   */
  update(
    idOrSlug: string | number,
    payload: UpdatePaymentPageRequest,
  ): Promise<GetPaymentPageApiResponse> {
    const path = `${this.basePath}/${encodeURIComponent(String(idOrSlug))}`

    return this.executor.put<GetPaymentPageApiResponse>(path, payload)
  }

  /**
   * Check if a slug is available.
   *
   * @param payload - The slug to check
   * @returns A promise resolving to the result
   * @see https://paystack.com/docs/api/page/#check-slug
   */
  checkSlug(payload: CheckSlugRequest): Promise<CheckSlugApiResponse> {
    const path = `${this.basePath}/check_slug`

    return this.executor.post<CheckSlugApiResponse>(path, payload)
  }
}
