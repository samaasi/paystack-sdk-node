import type {
    ListRefundsQuery,
    RetryRefundRequest,
    CreateRefundRequest,
    GetRefundApiResponse,
    ListRefundsApiResponse,
    RetryRefundApiResponse,
    CreateRefundApiResponse,
} from "./refunds.types"
import { BaseResource } from "../base"

export class RefundsResource extends BaseResource {
  private readonly basePath = "/refund"

  create(payload: CreateRefundRequest): Promise<CreateRefundApiResponse> {
    return this.executor.execute<CreateRefundApiResponse>(this.basePath, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  list(query: ListRefundsQuery = {}): Promise<ListRefundsApiResponse> {
    const search = new URLSearchParams()

    if (query.transaction !== undefined) {
      search.set("transaction", String(query.transaction))
    }

    if (query.from !== undefined) {
      search.set("from", query.from)
    }

    if (query.to !== undefined) {
      search.set("to", query.to)
    }

    if (query.perPage !== undefined) {
      search.set("perPage", String(query.perPage))
    }

    if (query.page !== undefined) {
      search.set("page", String(query.page))
    }

    const path =
      search.size > 0 ? `${this.basePath}?${search.toString()}` : this.basePath

    return this.executor.execute<ListRefundsApiResponse>(path, {
      method: "GET",
    })
  }

  get(idOrReference: number | string): Promise<GetRefundApiResponse> {
    const identifier = String(idOrReference)
    const path = `${this.basePath}/${encodeURIComponent(identifier)}`

    return this.executor.execute<GetRefundApiResponse>(path, {
      method: "GET",
    })
  }

  retry(
    id: number | string,
    payload: RetryRefundRequest,
  ): Promise<RetryRefundApiResponse> {
    const identifier = String(id)
    const path = `${this.basePath}/retry_with_customer_details/${encodeURIComponent(
      identifier,
    )}`

    return this.executor.execute<RetryRefundApiResponse>(path, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }
}
