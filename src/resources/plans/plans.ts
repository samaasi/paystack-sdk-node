import type {
  Plan,
  ListPlansQuery,
  UpdatePlanRequest,
  CreatePlanRequest,
  GetPlanApiResponse,
  ListPlansApiResponse,
  CreatePlanApiResponse,
  UpdatePlanApiResponse,
} from './plans.types'
import { BaseResource } from '../base'
import { stringifyQuery } from '../../utils/qs'
import { AutoPaginator } from '../../utils/pagination'

export class PlansResource extends BaseResource {
  private readonly basePath = '/plan'

  /**
   * Create a plan on your integration.
   *
   * @param payload - The plan creation details
   * @returns A promise resolving to the created plan details
   * @see https://paystack.com/docs/api/plan/#create
   */
  create(payload: CreatePlanRequest): Promise<CreatePlanApiResponse> {
    return this.executor.execute<CreatePlanApiResponse>(this.basePath, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  /**
   * List plans on your integration.
   *
   * @param query - The query parameters for listing plans
   * @returns A promise resolving to the list of plans
   * @see https://paystack.com/docs/api/plan/#list
   */
  list(query: ListPlansQuery = {}): Promise<ListPlansApiResponse> {
    const qs = stringifyQuery(query)
    const path = qs ? `${this.basePath}?${qs}` : this.basePath

    return this.executor.execute<ListPlansApiResponse>(path, {
      method: 'GET',
    })
  }

  listAll(query: ListPlansQuery = {}): AutoPaginator<Plan, ListPlansQuery> {
    return new AutoPaginator({ fetchPage: (q) => this.list(q), initialQuery: query })
  }

  /**
   * Fetch a plan on your integration.
   *
   * @param idOrCode - The plan ID or code
   * @returns A promise resolving to the plan details
   * @see https://paystack.com/docs/api/plan/#fetch
   */
  get(idOrCode: number | string): Promise<GetPlanApiResponse> {
    const id = String(idOrCode)
    const path = `${this.basePath}/${encodeURIComponent(id)}`

    return this.executor.execute<GetPlanApiResponse>(path, {
      method: 'GET',
    })
  }

  /**
   * Update a plan details on your integration.
   *
   * @param idOrCode - The plan ID or code
   * @param payload - The fields to update
   * @returns A promise resolving to the updated plan details
   * @see https://paystack.com/docs/api/plan/#update
   */
  update(
    idOrCode: number | string,
    payload: UpdatePlanRequest,
  ): Promise<UpdatePlanApiResponse> {
    const id = String(idOrCode)
    const path = `${this.basePath}/${encodeURIComponent(id)}`

    return this.executor.execute<UpdatePlanApiResponse>(path, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  }
}
