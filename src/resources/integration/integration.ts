import type {
  GetPaymentSessionTimeoutResponse,
  UpdatePaymentSessionTimeoutRequest,
  UpdatePaymentSessionTimeoutResponse,
} from "./integration.types"
import { BaseResource } from "../base"

export class IntegrationResource extends BaseResource {
  private readonly basePath = "/integration"

  getPaymentSessionTimeout(): Promise<GetPaymentSessionTimeoutResponse> {
    const path = `${this.basePath}/payment_session_timeout`

    return this.executor.execute<GetPaymentSessionTimeoutResponse>(path, {
      method: "GET",
    })
  }

  updatePaymentSessionTimeout(
    timeoutOrPayload: number | UpdatePaymentSessionTimeoutRequest,
  ): Promise<UpdatePaymentSessionTimeoutResponse> {
    const payload: UpdatePaymentSessionTimeoutRequest =
      typeof timeoutOrPayload === "number"
        ? { timeout: timeoutOrPayload }
        : timeoutOrPayload

    const path = `${this.basePath}/payment_session_timeout`

    return this.executor.execute<UpdatePaymentSessionTimeoutResponse>(path, {
      method: "PUT",
      body: JSON.stringify(payload),
    })
  }
}
