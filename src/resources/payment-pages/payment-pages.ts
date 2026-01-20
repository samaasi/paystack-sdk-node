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
    return this.executor.execute<GetPaymentPageApiResponse>(this.basePath, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
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
    const search = new URLSearchParams()

    if (query.perPage !== undefined) {
      search.set('perPage', String(query.perPage))
    }

    if (query.page !== undefined) {
      search.set('page', String(query.page))
    }

    if (query.from !== undefined) {
      search.set('from', query.from)
    }

    if (query.to !== undefined) {
      search.set('to', query.to)
    }

    const path =
      search.size > 0 ? `${this.basePath}?${search.toString()}` : this.basePath

    return this.executor.execute<ListPaymentPagesApiResponse>(path, {
      method: 'GET',
    })
  }

  get(idOrSlug: string | number): Promise<GetPaymentPageApiResponse> {
    const path = `${this.basePath}/${encodeURIComponent(String(idOrSlug))}`

    return this.executor.execute<GetPaymentPageApiResponse>(path, {
      method: 'GET',
    })
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

    return this.executor.execute<GetPaymentPageApiResponse>(path, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
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

    return this.executor.execute<CheckSlugApiResponse>(path, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }
}
