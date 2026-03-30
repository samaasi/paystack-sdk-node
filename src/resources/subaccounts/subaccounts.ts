import { BaseResource } from '../base'
import type {
  CreateSubaccountRequest,
  CreateSubaccountResponse,
  FetchSubaccountResponse,
  ListSubaccountsResponse,
  UpdateSubaccountRequest,
  UpdateSubaccountResponse,
} from './subaccounts.types'

export class SubaccountsResource extends BaseResource {
  private readonly basePath = '/subaccount'

  /**
   * Create a subaccount.
   *
   * @param payload - The subaccount creation payload
   * @returns A promise resolving to the created subaccount
   * @see https://paystack.com/docs/api/subaccount/#create
   */
  create(payload: CreateSubaccountRequest): Promise<CreateSubaccountResponse> {
    return this.executor.post<CreateSubaccountResponse>(this.basePath, payload)
  }

  /**
   * List subaccounts.
   *
   * @returns A promise resolving to the list of subaccounts
   * @see https://paystack.com/docs/api/subaccount/#list
   */
  list(): Promise<ListSubaccountsResponse> {
    return this.executor.get<ListSubaccountsResponse>(this.basePath)
  }

  /**
   * Fetch a subaccount.
   *
   * @param codeOrId - The subaccount code or ID
   * @returns A promise resolving to the subaccount details
   * @see https://paystack.com/docs/api/subaccount/#fetch
   */
  fetch(codeOrId: string | number): Promise<FetchSubaccountResponse> {
    const id = String(codeOrId)

    return this.executor.get<FetchSubaccountResponse>(
      `${this.basePath}/${encodeURIComponent(id)}`,
    )
  }

  /**
   * Update a subaccount.
   *
   * @param code - The subaccount code
   * @param payload - The update payload
   * @returns A promise resolving to the updated subaccount
   * @see https://paystack.com/docs/api/subaccount/#update
   */
  update(
    code: string,
    payload: UpdateSubaccountRequest,
  ): Promise<UpdateSubaccountResponse> {
    return this.executor.put<UpdateSubaccountResponse>(
      `${this.basePath}/${encodeURIComponent(code)}`,
      payload,
    )
  }
}
