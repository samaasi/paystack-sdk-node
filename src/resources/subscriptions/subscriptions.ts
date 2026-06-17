import { BaseResource } from '../base'
import { stringifyQuery } from '../../utils/qs'
import { AutoPaginator, type PaginatorOptions } from '../../utils/pagination'
import type { Subscription } from './subscriptions.types'
import type {
  CreateSubscriptionRequest,
  CreateSubscriptionResponse,
  FetchSubscriptionResponse,
  ListSubscriptionsResponse,
} from './subscriptions.types'

export class SubscriptionsResource extends BaseResource {
  private readonly basePath = '/subscription'

  /**
   * Create a subscription.
   *
   * @param payload - The subscription creation payload
   * @returns A promise resolving to the created subscription
   * @see https://paystack.com/docs/api/subscription/#create
   */
  create(
    payload: CreateSubscriptionRequest,
  ): Promise<CreateSubscriptionResponse> {
    return this.executor.post<CreateSubscriptionResponse>(
      this.basePath,
      payload,
    )
  }

  /**
   * List subscriptions.
   *
   * @returns A promise resolving to the list of subscriptions
   * @see https://paystack.com/docs/api/subscription/#list
   */
  list(
    query: Record<string, unknown> = {},
  ): Promise<ListSubscriptionsResponse> {
    const qs = stringifyQuery(query)
    const path = qs ? `${this.basePath}?${qs}` : this.basePath

    return this.executor.get<ListSubscriptionsResponse>(path)
  }

  /**
   * List subscriptions via async iterator.
   */
  listAll(
    query: Record<string, unknown> = {},
  ): AutoPaginator<Subscription, Record<string, unknown>> {
    return new AutoPaginator({
      fetchPage: (q) => this.list(q),
      initialQuery: query,
    })
  }

  /**
   * Fetch a subscription.
   *
   * @param codeOrId - The subscription code or ID
   * @returns A promise resolving to the subscription details
   * @see https://paystack.com/docs/api/subscription/#fetch
   */
  fetch(codeOrId: string | number): Promise<FetchSubscriptionResponse> {
    return this.executor.get<FetchSubscriptionResponse>(
      `${this.basePath}/${encodeURIComponent(String(codeOrId))}`,
    )
  }

  /**
   * Disable a subscription.
   *
   * @param code - The subscription code
   * @param token - The email token for disabling
   * @returns A promise resolving to the result
   * @see https://paystack.com/docs/api/subscription/#disable
   */
  disable(code: string, token: string): Promise<FetchSubscriptionResponse> {
    return this.executor.post<FetchSubscriptionResponse>(
      `${this.basePath}/disable`,
      { code, token },
    )
  }
}
