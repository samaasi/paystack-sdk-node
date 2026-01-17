import { BaseResource } from "../base"
import type {
    ListCustomersQuery,
    CreateCustomerRequest,
    ListCustomersResponse,
    UpdateCustomerRequest,
    CreateCustomerApiResponse,
} from "./customers.types"
import { withIdempotencyKey } from "../../utils/idempotency"

export interface CreateCustomerOptions {
  idempotencyKey?: string
}

export class CustomersResource extends BaseResource {
  private readonly basePath = "/customer"

  /**
   * Create a customer on your integration.
   *
   * @see https://paystack.com/docs/api/customer/#create
   */
  create(
    payload: CreateCustomerRequest,
    options: CreateCustomerOptions = {},
  ): Promise<CreateCustomerApiResponse> {
    const init = withIdempotencyKey(
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      options.idempotencyKey,
    )

    return this.executor.execute<CreateCustomerApiResponse>(this.basePath, init)
  }

  /**
   * List customers available on your integration.
   *
   * @see https://paystack.com/docs/api/customer/#list
   */
  list(query: ListCustomersQuery = {}): Promise<ListCustomersResponse> {
    const search = new URLSearchParams()

    if (query.perPage !== undefined) {
      search.set("perPage", String(query.perPage))
    }

    if (query.page !== undefined) {
      search.set("page", String(query.page))
    }

    const path =
      search.size > 0
        ? `${this.basePath}?${search.toString()}`
        : this.basePath

    return this.executor.execute<ListCustomersResponse>(path, {
      method: "GET",
    })
  }

  /**
   * Update a customer's details on your integration.
   *
   * @see https://paystack.com/docs/api/customer/#update
   */
  update(
    customerCodeOrEmail: string,
    payload: UpdateCustomerRequest,
  ): Promise<CreateCustomerApiResponse> {
    return this.executor.execute<CreateCustomerApiResponse>(
      `${this.basePath}/${encodeURIComponent(customerCodeOrEmail)}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
    )
  }
}
