import type {
  ListBulkChargeItemsQuery,
    CreateBulkChargeRequest,
  ListBulkChargeBatchesQuery,
  GetBulkChargeBatchApiResponse,
    CreateBulkChargeApiResponse,
  ListBulkChargeItemsApiResponse,
  ListBulkChargeBatchesApiResponse,
} from "./bulk-charges.types"
import { BaseResource } from "../base"

export class BulkChargesResource extends BaseResource {
  private readonly basePath = "/bulkcharge"

  create(payload: CreateBulkChargeRequest): Promise<CreateBulkChargeApiResponse> {
    return this.executor.execute<CreateBulkChargeApiResponse>(this.basePath, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

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

  get(batchCode: string): Promise<GetBulkChargeBatchApiResponse> {
    const path = `${this.basePath}/${encodeURIComponent(batchCode)}`

    return this.executor.execute<GetBulkChargeBatchApiResponse>(path, {
      method: "GET",
    })
  }

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

  pause(batchCode: string): Promise<GetBulkChargeBatchApiResponse> {
    const path = `${this.basePath}/pause/${encodeURIComponent(batchCode)}`

    return this.executor.execute<GetBulkChargeBatchApiResponse>(path, {
      method: "GET",
    })
  }

  resume(batchCode: string): Promise<GetBulkChargeBatchApiResponse> {
    const path = `${this.basePath}/resume/${encodeURIComponent(batchCode)}`

    return this.executor.execute<GetBulkChargeBatchApiResponse>(path, {
      method: "GET",
    })
  }
}
