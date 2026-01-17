import type {
    SettlementStatus,
    ListSettlementsQuery,
    ListSettlementsApiResponse,
    ListSettlementTransactionsQuery,
    ListSettlementTransactionsApiResponse,
} from "./settlements.types"
import { BaseResource } from "../base"

export class SettlementsResource extends BaseResource {
  private readonly basePath = "/settlement"

  list(query: ListSettlementsQuery = {}): Promise<ListSettlementsApiResponse> {
    const search = new URLSearchParams()

    if (query.perPage !== undefined) {
      search.set("perPage", String(query.perPage))
    }

    if (query.page !== undefined) {
      search.set("page", String(query.page))
    }

    if (query.status !== undefined) {
      search.set("status", query.status as SettlementStatus)
    }

    if (query.subaccount !== undefined) {
      search.set("subaccount", query.subaccount)
    }

    if (query.from !== undefined) {
      search.set("from", query.from)
    }

    if (query.to !== undefined) {
      search.set("to", query.to)
    }

    const path =
      search.size > 0 ? `${this.basePath}?${search.toString()}` : this.basePath

    return this.executor.execute<ListSettlementsApiResponse>(path, {
      method: "GET",
    })
  }

  listTransactions(
    settlementId: number | string,
    query: ListSettlementTransactionsQuery = {},
  ): Promise<ListSettlementTransactionsApiResponse> {
    const id = String(settlementId)
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

    const base = `${this.basePath}/${encodeURIComponent(id)}/transactions`
    const path =
      search.size > 0 ? `${base}?${search.toString()}` : base

    return this.executor.execute<ListSettlementTransactionsApiResponse>(path, {
      method: "GET",
    })
  }
}
