import type {
    ListPaymentRequestsQuery,
    UpdatePaymentRequestRequest,
    CreatePaymentRequestRequest,
    GetPaymentRequestApiResponse,
    ListPaymentRequestsApiResponse,
    VerifyPaymentRequestApiResponse,
    GetPaymentRequestTotalsApiResponse,
} from "./payment-requests.types"
import { BaseResource } from "../base"

export class PaymentRequestsResource extends BaseResource {
  private readonly basePath = "/paymentrequest"

  create(
    payload: CreatePaymentRequestRequest,
  ): Promise<GetPaymentRequestApiResponse> {
    return this.executor.execute<GetPaymentRequestApiResponse>(this.basePath, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  list(
    query: ListPaymentRequestsQuery = {},
  ): Promise<ListPaymentRequestsApiResponse> {
    const search = new URLSearchParams()

    if (query.perPage !== undefined) {
      search.set("perPage", String(query.perPage))
    }

    if (query.page !== undefined) {
      search.set("page", String(query.page))
    }

    if (query.status !== undefined) {
      search.set("status", query.status)
    }

    if (query.from !== undefined) {
      search.set("from", query.from)
    }

    if (query.to !== undefined) {
      search.set("to", query.to)
    }

    const path =
      search.size > 0
        ? `${this.basePath}?${search.toString()}`
        : this.basePath

    return this.executor.execute<ListPaymentRequestsApiResponse>(path, {
      method: "GET",
    })
  }

  get(id: number): Promise<GetPaymentRequestApiResponse> {
    const path = `${this.basePath}/${id}`

    return this.executor.execute<GetPaymentRequestApiResponse>(path, {
      method: "GET",
    })
  }

  update(
    id: number,
    payload: UpdatePaymentRequestRequest,
  ): Promise<GetPaymentRequestApiResponse> {
    const path = `${this.basePath}/${id}`

    return this.executor.execute<GetPaymentRequestApiResponse>(path, {
      method: "PUT",
      body: JSON.stringify(payload),
    })
  }

  sendNotification(id: number): Promise<GetPaymentRequestApiResponse> {
    const path = `${this.basePath}/notify/${id}`

    return this.executor.execute<GetPaymentRequestApiResponse>(path, {
      method: "POST",
    })
  }

  totals(): Promise<GetPaymentRequestTotalsApiResponse> {
    const path = `${this.basePath}/totals`

    return this.executor.execute<GetPaymentRequestTotalsApiResponse>(path, {
      method: "GET",
    })
  }

  verify(code: string): Promise<VerifyPaymentRequestApiResponse> {
    const path = `${this.basePath}/verify/${encodeURIComponent(code)}`

    return this.executor.execute<VerifyPaymentRequestApiResponse>(path, {
      method: "GET",
    })
  }

  archive(id: number): Promise<GetPaymentRequestApiResponse> {
    const path = `${this.basePath}/archive/${id}`

    return this.executor.execute<GetPaymentRequestApiResponse>(path, {
      method: "POST",
    })
  }
}
