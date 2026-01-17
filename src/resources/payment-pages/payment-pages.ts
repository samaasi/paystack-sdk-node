import type {
    CheckSlugRequest,
    CheckSlugApiResponse,
    ListPaymentPagesQuery,
    UpdatePaymentPageRequest,
    CreatePaymentPageRequest,
    GetPaymentPageApiResponse,
    ListPaymentPagesApiResponse,
} from "./payment-pages.types"
import { BaseResource } from "../base"

export class PaymentPagesResource extends BaseResource {
  private readonly basePath = "/page"

  create(payload: CreatePaymentPageRequest): Promise<GetPaymentPageApiResponse> {
    return this.executor.execute<GetPaymentPageApiResponse>(this.basePath, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  list(
    query: ListPaymentPagesQuery = {},
  ): Promise<ListPaymentPagesApiResponse> {
    const search = new URLSearchParams()

    if (query.perPage !== undefined) {
      search.set("perPage", String(query.perPage))
    }

    if (query.page !== undefined) {
      search.set("page", String(query.page))
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

    return this.executor.execute<ListPaymentPagesApiResponse>(path, {
      method: "GET",
    })
  }

  get(idOrSlug: string | number): Promise<GetPaymentPageApiResponse> {
    const path = `${this.basePath}/${encodeURIComponent(String(idOrSlug))}`

    return this.executor.execute<GetPaymentPageApiResponse>(path, {
      method: "GET",
    })
  }

  update(
    idOrSlug: string | number,
    payload: UpdatePaymentPageRequest,
  ): Promise<GetPaymentPageApiResponse> {
    const path = `${this.basePath}/${encodeURIComponent(String(idOrSlug))}`

    return this.executor.execute<GetPaymentPageApiResponse>(path, {
      method: "PUT",
      body: JSON.stringify(payload),
    })
  }

  checkSlug(payload: CheckSlugRequest): Promise<CheckSlugApiResponse> {
    const path = `${this.basePath}/check_slug`

    return this.executor.execute<CheckSlugApiResponse>(path, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }
}
