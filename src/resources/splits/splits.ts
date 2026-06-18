import type {
  Split,
  ListSplitsQuery,
  CreateSplitRequest,
  UpdateSplitRequest,
  GetSplitApiResponse,
  AddSubaccountRequest,
  ListSplitsApiResponse,
  CreateSplitApiResponse,
  UpdateSplitApiResponse,
  RemoveSubaccountRequest,
  AddSubaccountApiResponse,
  RemoveSubaccountApiResponse,
} from './splits.types'
import { BaseResource } from '../base'
import { stringifyQuery } from '../../utils/qs'
import { AutoPaginator } from '../../utils/pagination'

export class SplitsResource extends BaseResource {
  private readonly basePath = '/split'

  /**
   * Create a transaction split.
   *
   * @param payload - The split creation payload
   * @returns A promise resolving to the created split
   * @see https://paystack.com/docs/api/split/#create
   */
  create(payload: CreateSplitRequest): Promise<CreateSplitApiResponse> {
    return this.executor.execute<CreateSplitApiResponse>(this.basePath, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  /**
   * List transaction splits.
   *
   * @param query - The query parameters for filtering
   * @returns A promise resolving to the list of splits
   * @see https://paystack.com/docs/api/split/#list
   */
  list(query: ListSplitsQuery = {}): Promise<ListSplitsApiResponse> {
    const qs = stringifyQuery(query)
    const path = qs ? `${this.basePath}?${qs}` : this.basePath

    return this.executor.execute<ListSplitsApiResponse>(path, {
      method: 'GET',
    })
  }

  listAll(query: ListSplitsQuery = {}): AutoPaginator<Split, ListSplitsQuery> {
    return new AutoPaginator({ fetchPage: (q) => this.list(q), initialQuery: query })
  }

  /**
   * Get details of a split.
   *
   * @param id - The split ID or code
   * @returns A promise resolving to the split details
   * @see https://paystack.com/docs/api/split/#fetch
   */
  get(id: number | string): Promise<GetSplitApiResponse> {
    const identifier = String(id)
    const path = `${this.basePath}/${encodeURIComponent(identifier)}`

    return this.executor.execute<GetSplitApiResponse>(path, {
      method: 'GET',
    })
  }

  /**
   * Update a transaction split.
   *
   * @param id - The split ID or code
   * @param payload - The update payload
   * @returns A promise resolving to the updated split
   * @see https://paystack.com/docs/api/split/#update
   */
  update(
    id: number | string,
    payload: UpdateSplitRequest,
  ): Promise<UpdateSplitApiResponse> {
    const identifier = String(id)
    const path = `${this.basePath}/${encodeURIComponent(identifier)}`

    return this.executor.execute<UpdateSplitApiResponse>(path, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  }

  /**
   * Add a subaccount to a split.
   *
   * @param id - The split ID or code
   * @param payload - The subaccount to add
   * @returns A promise resolving to the result
   * @see https://paystack.com/docs/api/split/#add-subaccount
   */
  addSubaccount(
    id: number | string,
    payload: AddSubaccountRequest,
  ): Promise<AddSubaccountApiResponse> {
    const identifier = String(id)
    const path = `${this.basePath}/${encodeURIComponent(
      identifier,
    )}/subaccount/add`

    return this.executor.execute<AddSubaccountApiResponse>(path, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  /**
   * Remove a subaccount from a split.
   *
   * @param id - The split ID or code
   * @param payload - The subaccount to remove
   * @returns A promise resolving to the result
   * @see https://paystack.com/docs/api/split/#remove-subaccount
   */
  removeSubaccount(
    id: number | string,
    payload: RemoveSubaccountRequest,
  ): Promise<RemoveSubaccountApiResponse> {
    const identifier = String(id)
    const path = `${this.basePath}/${encodeURIComponent(
      identifier,
    )}/subaccount/remove`

    return this.executor.execute<RemoveSubaccountApiResponse>(path, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }
}
