import { BaseResource } from '../base'
import type {
  VirtualAccount,
  ListDedicatedVirtualAccountsQuery,
  AssignDedicatedVirtualAccountRequest,
  ListDedicatedVirtualAccountsResponse,
  AssignDedicatedVirtualAccountResponse,
  RequeryDedicatedVirtualAccountRequest,
  RequeryDedicatedVirtualAccountResponse,
} from './virtual-accounts.types'
import { withIdempotencyKey } from '../../utils/idempotency'
import { stringifyQuery } from '../../utils/qs'
import { AutoPaginator } from '../../utils/pagination'

export interface AssignDedicatedVirtualAccountOptions {
  idempotencyKey?: string
}

export class VirtualAccountsResource extends BaseResource {
  private readonly basePath = '/dedicated_account'

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
        method: 'POST',
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
    const qs = stringifyQuery(query)
    const path = qs ? `${this.basePath}?${qs}` : this.basePath

    return this.executor.execute<ListDedicatedVirtualAccountsResponse>(path, {
      method: 'GET',
    })
  }

  listAll(
    query: ListDedicatedVirtualAccountsQuery = {},
  ): AutoPaginator<VirtualAccount, ListDedicatedVirtualAccountsQuery> {
    return new AutoPaginator({ fetchPage: (q) => this.list(q), initialQuery: query })
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
    const qs = stringifyQuery(params)
    const path = `${this.basePath}/requery?${qs}`

    return this.executor.execute<RequeryDedicatedVirtualAccountResponse>(path, {
      method: 'GET',
    })
  }
}
