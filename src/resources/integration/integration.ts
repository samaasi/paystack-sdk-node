import type {
  GetPaymentSessionTimeoutResponse,
  UpdatePaymentSessionTimeoutRequest,
  UpdatePaymentSessionTimeoutResponse,
} from './integration.types'
import { BaseResource } from '../base'

export class IntegrationResource extends BaseResource {
  private readonly basePath = '/integration'

  /**
   * Get payment session timeout.
   *
   * @returns A promise resolving to the payment session timeout
   * @see https://paystack.com/docs/api/integration/#payment-session-timeout
   */
  getPaymentSessionTimeout(): Promise<GetPaymentSessionTimeoutResponse> {
    const path = `${this.basePath}/payment_session_timeout`

    return this.executor.execute<GetPaymentSessionTimeoutResponse>(path, {
      method: 'GET',
    })
  }

  /**
   * Update payment session timeout.
   *
   * @param timeoutOrPayload - The new timeout in seconds or an object containing the timeout
   * @returns A promise resolving to the updated payment session timeout
   * @see https://paystack.com/docs/api/integration/#update-payment-session-timeout
   */
  updatePaymentSessionTimeout(
    timeoutOrPayload: number | UpdatePaymentSessionTimeoutRequest,
  ): Promise<UpdatePaymentSessionTimeoutResponse> {
    const payload: UpdatePaymentSessionTimeoutRequest =
      typeof timeoutOrPayload === 'number'
        ? { timeout: timeoutOrPayload }
        : timeoutOrPayload

    const path = `${this.basePath}/payment_session_timeout`

    return this.executor.execute<UpdatePaymentSessionTimeoutResponse>(path, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  }
}
