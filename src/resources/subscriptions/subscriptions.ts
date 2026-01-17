import { BaseResource } from "../base"
import type {
  CreateSubscriptionRequest,
  CreateSubscriptionResponse,
  FetchSubscriptionResponse,
  ListSubscriptionsResponse,
} from "./subscriptions.types"

export class SubscriptionsResource extends BaseResource {
  private readonly basePath = "/subscription"

  create(
    payload: CreateSubscriptionRequest,
  ): Promise<CreateSubscriptionResponse> {
    return this.executor.execute<CreateSubscriptionResponse>(this.basePath, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  list(): Promise<ListSubscriptionsResponse> {
    return this.executor.execute<ListSubscriptionsResponse>(this.basePath, {
      method: "GET",
    })
  }

  fetch(codeOrId: string | number): Promise<FetchSubscriptionResponse> {
    const id = String(codeOrId)

    return this.executor.execute<FetchSubscriptionResponse>(
      `${this.basePath}/${encodeURIComponent(id)}`,
      {
        method: "GET",
      },
    )
  }

  disable(code: string, token: string): Promise<FetchSubscriptionResponse> {
    const body = JSON.stringify({ code, token })

    return this.executor.execute<FetchSubscriptionResponse>(
      `${this.basePath}/disable`,
      {
        method: "POST",
        body,
      },
    )
  }
}
