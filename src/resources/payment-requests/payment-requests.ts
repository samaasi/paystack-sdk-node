import type {
  ListPaymentRequestsQuery,
  UpdatePaymentRequestRequest,
  CreatePaymentRequestRequest,
  GetPaymentRequestApiResponse,
  ListPaymentRequestsApiResponse,
  VerifyPaymentRequestApiResponse,
  GetPaymentRequestTotalsApiResponse,
} from './payment-requests.types'
import { BaseResource } from '../base'

export class PaymentRequestsResource extends BaseResource {
  private readonly basePath = '/paymentrequest'

  /**
   * Create a payment request.
   *
   * @param payload - The payment request creation payload
   * @returns A promise resolving to the created payment request
   * @see https://paystack.com/docs/api/payment-request/#create
   */
  create(
    payload: CreatePaymentRequestRequest,
  ): Promise<GetPaymentRequestApiResponse> {
    return this.executor.execute<GetPaymentRequestApiResponse>(this.basePath, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  /**
   * List payment requests.
   *
   * @param query - The query parameters for filtering
   * @returns A promise resolving to the list of payment requests
   * @see https://paystack.com/docs/api/payment-request/#list
   */
  list(
    query: ListPaymentRequestsQuery = {},
  ): Promise<ListPaymentRequestsApiResponse> {
    const search = new URLSearchParams()

    if (query.perPage !== undefined) {
      search.set('perPage', String(query.perPage))
    }

    if (query.page !== undefined) {
      search.set('page', String(query.page))
    }

    if (query.status !== undefined) {
      search.set('status', query.status)
    }

    if (query.from !== undefined) {
      search.set('from', query.from)
    }

    if (query.to !== undefined) {
      search.set('to', query.to)
    }

    const path =
      search.size > 0 ? `${this.basePath}?${search.toString()}` : this.basePath

    return this.executor.execute<ListPaymentRequestsApiResponse>(path, {
      method: 'GET',
    })
  }

  /**
   * Fetch a payment request.
   *
   * @param id - The payment request ID
   * @returns A promise resolving to the payment request details
   * @see https://paystack.com/docs/api/payment-request/#fetch
   */
  get(id: number): Promise<GetPaymentRequestApiResponse> {
    const path = `${this.basePath}/${id}`

    return this.executor.execute<GetPaymentRequestApiResponse>(path, {
      method: 'GET',
    })
  }

  /**
   * Update a payment request.
   *
   * @param id - The payment request ID
   * @param payload - The update payload
   * @returns A promise resolving to the updated payment request
   * @see https://paystack.com/docs/api/payment-request/#update
   */
  update(
    id: number,
    payload: UpdatePaymentRequestRequest,
  ): Promise<GetPaymentRequestApiResponse> {
    const path = `${this.basePath}/${id}`

    return this.executor.execute<GetPaymentRequestApiResponse>(path, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  }

  /**
   * Send notification for a payment request.
   *
   * @param id - The payment request ID
   * @returns A promise resolving to the result
   * @see https://paystack.com/docs/api/payment-request/#notify
   */
  sendNotification(id: number): Promise<GetPaymentRequestApiResponse> {
    const path = `${this.basePath}/notify/${id}`

    return this.executor.execute<GetPaymentRequestApiResponse>(path, {
      method: 'POST',
    })
  }

  /**
   * Get payment request totals.
   *
   * @returns A promise resolving to the totals
   * @see https://paystack.com/docs/api/payment-request/#totals
   */
  totals(): Promise<GetPaymentRequestTotalsApiResponse> {
    const path = `${this.basePath}/totals`

    return this.executor.execute<GetPaymentRequestTotalsApiResponse>(path, {
      method: 'GET',
    })
  }

  verify(code: string): Promise<VerifyPaymentRequestApiResponse> {
    const path = `${this.basePath}/verify/${encodeURIComponent(code)}`

    return this.executor.execute<VerifyPaymentRequestApiResponse>(path, {
      method: 'GET',
    })
  }

  /**
   * Archive a payment request.
   *
   * @param id - The payment request ID
   * @returns A promise resolving to the result
   * @see https://paystack.com/docs/api/payment-request/#archive
   */
  archive(id: number): Promise<GetPaymentRequestApiResponse> {
    const path = `${this.basePath}/archive/${id}`

    return this.executor.execute<GetPaymentRequestApiResponse>(path, {
      method: 'POST',
    })
  }
}
