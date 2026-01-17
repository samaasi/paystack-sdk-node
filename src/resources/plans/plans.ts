import type {
    PlanStatus,
    PlanInterval,
    ListPlansQuery,
    UpdatePlanRequest,
    CreatePlanRequest,
    GetPlanApiResponse,
    ListPlansApiResponse,
    CreatePlanApiResponse,
    UpdatePlanApiResponse,
} from "./plans.types"
import { BaseResource } from "../base"

export class PlansResource extends BaseResource {
  private readonly basePath = "/plan"

  create(payload: CreatePlanRequest): Promise<CreatePlanApiResponse> {
    return this.executor.execute<CreatePlanApiResponse>(this.basePath, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  list(query: ListPlansQuery = {}): Promise<ListPlansApiResponse> {
    const search = new URLSearchParams()

    if (query.perPage !== undefined) {
      search.set("perPage", String(query.perPage))
    }

    if (query.page !== undefined) {
      search.set("page", String(query.page))
    }

    if (query.status !== undefined) {
      search.set("status", query.status as PlanStatus)
    }

    if (query.interval !== undefined) {
      search.set("interval", query.interval as PlanInterval)
    }

    if (query.amount !== undefined) {
      search.set("amount", String(query.amount))
    }

    if (query.from !== undefined) {
      search.set("from", query.from)
    }

    if (query.to !== undefined) {
      search.set("to", query.to)
    }

    const path =
      search.size > 0 ? `${this.basePath}?${search.toString()}` : this.basePath

    return this.executor.execute<ListPlansApiResponse>(path, {
      method: "GET",
    })
  }

  get(idOrCode: number | string): Promise<GetPlanApiResponse> {
    const id = String(idOrCode)
    const path = `${this.basePath}/${encodeURIComponent(id)}`

    return this.executor.execute<GetPlanApiResponse>(path, {
      method: "GET",
    })
  }

  update(
    idOrCode: number | string,
    payload: UpdatePlanRequest,
  ): Promise<UpdatePlanApiResponse> {
    const id = String(idOrCode)
    const path = `${this.basePath}/${encodeURIComponent(id)}`

    return this.executor.execute<UpdatePlanApiResponse>(path, {
      method: "PUT",
      body: JSON.stringify(payload),
    })
  }
}
