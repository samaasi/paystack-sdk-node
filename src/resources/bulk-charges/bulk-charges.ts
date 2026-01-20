import type {
    CreateBulkChargeRequest,
    ListBulkChargeItemsQuery,
    ListBulkChargeBatchesQuery,
    CreateBulkChargeApiResponse,
    GetBulkChargeBatchApiResponse,
    ListBulkChargeItemsApiResponse,
    ListBulkChargeBatchesApiResponse,
} from "./bulk-charges.types"
import { BaseResource } from "../base"

export class BulkChargesResource extends BaseResource {
  private readonly basePath = "/bulkcharge"

  /**
   * Create a bulk charge.
   *
   * @param payload - The bulk charge creation payload
   * @returns A promise resolving to the created bulk charge details
   * @see https://paystack.com/docs/api/bulk-charge/#initiate
   */
  create(payload: CreateBulkChargeRequest): Promise<CreateBulkChargeApiResponse> {
    return this.executor.execute<CreateBulkChargeApiResponse>(this.basePath, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  /**
   * List bulk charge batches.
   *
   * @param query - The query parameters for filtering
   * @returns A promise resolving to the list of bulk charge batches
   * @see https://paystack.com/docs/api/bulk-charge/#list
   */
  listBatches(
    query: ListBulkChargeBatchesQuery = {},
  ): Promise<ListBulkChargeBatchesApiResponse> {
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

    return this.executor.execute<ListBulkChargeBatchesApiResponse>(path, {
      method: "GET",
    })
  }

  /**
   * Fetch a bulk charge batch.
   *
   * @param batchCode - The bulk charge batch code
   * @returns A promise resolving to the batch details
   * @see https://paystack.com/docs/api/bulk-charge/#fetch
   */
  get(batchCode: string): Promise<GetBulkChargeBatchApiResponse> {
    const path = `${this.basePath}/${encodeURIComponent(batchCode)}`

    return this.executor.execute<GetBulkChargeBatchApiResponse>(path, {
      method: "GET",
    })
  }

  /**
   * List charges in a batch.
   *
   * @param batchCode - The bulk charge batch code
   * @param query - The query parameters for filtering
   * @returns A promise resolving to the list of charges in the batch
   * @see https://paystack.com/docs/api/bulk-charge/#fetch-charges
   */
  listItems(
    batchCode: string,
    query: ListBulkChargeItemsQuery = {},
  ): Promise<ListBulkChargeItemsApiResponse> {
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

    const path =
      search.size > 0
        ? `${this.basePath}/${encodeURIComponent(
            batchCode,
          )}/charges?${search.toString()}`
        : `${this.basePath}/${encodeURIComponent(batchCode)}/charges`

    return this.executor.execute<ListBulkChargeItemsApiResponse>(path, {
      method: "GET",
    })
  }

  /**
   * Pause a bulk charge batch.
   *
   * @param batchCode - The bulk charge batch code
   * @returns A promise resolving to the result
   * @see https://paystack.com/docs/api/bulk-charge/#pause
   */
  pause(batchCode: string): Promise<GetBulkChargeBatchApiResponse> {
    const path = `${this.basePath}/pause/${encodeURIComponent(batchCode)}`

    return this.executor.execute<GetBulkChargeBatchApiResponse>(path, {
      method: "GET",
    })
  }

  /**
   * Resume a bulk charge batch.
   *
   * @param batchCode - The bulk charge batch code
   * @returns A promise resolving to the result
   * @see https://paystack.com/docs/api/bulk-charge/#resume
   */
  resume(batchCode: string): Promise<GetBulkChargeBatchApiResponse> {
    const path = `${this.basePath}/resume/${encodeURIComponent(batchCode)}`

    return this.executor.execute<GetBulkChargeBatchApiResponse>(path, {
      method: "GET",
    })
  }
}
