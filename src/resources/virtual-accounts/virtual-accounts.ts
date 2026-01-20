import { BaseResource } from "../base"
import type {
    ListDedicatedVirtualAccountsQuery,
  AssignDedicatedVirtualAccountRequest,
  ListDedicatedVirtualAccountsResponse,
  AssignDedicatedVirtualAccountResponse,
  RequeryDedicatedVirtualAccountRequest,
  RequeryDedicatedVirtualAccountResponse,
} from "./virtual-accounts.types"
import { withIdempotencyKey } from "../../utils/idempotency"

export interface AssignDedicatedVirtualAccountOptions {
  idempotencyKey?: string
}

export class VirtualAccountsResource extends BaseResource {
  private readonly basePath = "/dedicated_account"

  /**
   * Assign a dedicated virtual account to a customer.
   *
   * @see https://paystack.com/docs/api/dedicated-virtual-account/#assign
   */
  assign(
    payload: AssignDedicatedVirtualAccountRequest,
    options: AssignDedicatedVirtualAccountOptions = {},
  ): Promise<AssignDedicatedVirtualAccountResponse> {
    const init = withIdempotencyKey(
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      options.idempotencyKey,
    )

    return this.executor.execute<AssignDedicatedVirtualAccountResponse>(
      this.basePath,
      init,
    )
  }

  /**
   * List dedicated virtual accounts available on your integration.
   *
   * @see https://paystack.com/docs/api/dedicated-virtual-account/#list
   */
  list(
    query: ListDedicatedVirtualAccountsQuery = {},
  ): Promise<ListDedicatedVirtualAccountsResponse> {
    const search = new URLSearchParams()

    if (query.active !== undefined) {
      search.set("active", String(query.active))
    }

    if (query.currency !== undefined) {
      search.set("currency", query.currency)
    }

    if (query.provider_slug !== undefined) {
      search.set("provider_slug", query.provider_slug)
    }

    if (query.bank_id !== undefined) {
      search.set("bank_id", query.bank_id)
    }

    if (query.customer !== undefined) {
      search.set("customer", String(query.customer))
    }

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

    return this.executor.execute<ListDedicatedVirtualAccountsResponse>(path, {
      method: "GET",
    })
  }

  /**
   * Re-query a dedicated virtual account for new transactions.
   *
   * @param params - The requery parameters
   * @returns A promise resolving to the requery response
   * @see https://paystack.com/docs/api/dedicated-virtual-account/#requery
   */
  requery(
    params: RequeryDedicatedVirtualAccountRequest,
  ): Promise<RequeryDedicatedVirtualAccountResponse> {
    const search = new URLSearchParams()
    search.set("account_number", params.account_number)
    search.set("provider_slug", params.provider_slug)

    if (params.date !== undefined) {
      search.set("date", params.date)
    }

    const path = `${this.basePath}/requery?${search.toString()}`

    return this.executor.execute<RequeryDedicatedVirtualAccountResponse>(path, {
      method: "GET",
    })
  }
}
