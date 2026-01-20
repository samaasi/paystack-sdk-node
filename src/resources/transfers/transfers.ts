import { BaseResource } from '../base'
import type {
  FinalizeTransferRequest,
  FinalizeTransferResponse,
  InitiateTransferRequest,
  InitiateTransferResponse,
} from './transfers.types'
import { withIdempotencyKey } from '../../utils/idempotency'

export interface InitiateTransferOptions {
  idempotencyKey?: string
}

export class TransfersResource extends BaseResource {
  private readonly basePath = '/transfer'

  /**
   * Initiate a single transfer.
   *
   * @param payload - The transfer details
   * @param options - Optional parameters (e.g., idempotency key)
   * @returns A promise resolving to the transfer response
   * @see https://paystack.com/docs/api/transfer/#initiate
   */
  initiate(
    payload: InitiateTransferRequest,
    options: InitiateTransferOptions = {},
  ): Promise<InitiateTransferResponse> {
    const init = withIdempotencyKey(
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      options.idempotencyKey,
    )

    return this.executor.execute<InitiateTransferResponse>(this.basePath, init)
  }

  /**
   * Finalize a transfer that requires OTP.
   *
   * @param payload - The finalization details (OTP, transfer code)
   * @returns A promise resolving to the finalization response
   * @see https://paystack.com/docs/api/transfer/#finalize
   */
  finalize(
    payload: FinalizeTransferRequest,
  ): Promise<FinalizeTransferResponse> {
    return this.executor.execute<FinalizeTransferResponse>(
      `${this.basePath}/finalize_transfer`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    )
  }
}
