import { BaseResource } from '../base'
import type {
  GetBalanceResponse,
  TransferControlResponse,
  TransferEnableOtpRequest,
  TransferResendOtpRequest,
  TransferDisableOtpRequest,
  TransferFinalizeDisableOtpRequest,
} from './transfer-control.types'

/**
 * Transfer Control resource
 * @see https://paystack.com/docs/api/transfer-control/
 */
export class TransferControlResource extends BaseResource {
  private readonly transferBasePath = '/transfer'
  private readonly balancePath = '/balance'

  /**
   * Resend OTP for transfer
   * @param payload - The transfer code and reason
   * @returns A promise resolving to the response
   * @see https://paystack.com/docs/api/transfer-control/#resend-otp
   */
  resendOtp(
    payload: TransferResendOtpRequest,
  ): Promise<TransferControlResponse> {
    return this.executor.execute<TransferControlResponse>(
      `${this.transferBasePath}/resend_otp`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    )
  }

  /**
   * Disable OTP for transfer
   * @returns A promise resolving to the response
   * @see https://paystack.com/docs/api/transfer-control/#disable-otp
   */
  disableOtp(
    payload: TransferDisableOtpRequest,
  ): Promise<TransferControlResponse> {
    return this.executor.execute<TransferControlResponse>(
      `${this.transferBasePath}/disable_otp`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    )
  }

  /**
   * Finalize disabling OTP for transfer
   * @param payload - The OTP
   * @returns A promise resolving to the response
   * @see https://paystack.com/docs/api/transfer-control/#finalize-disable-otp
   */
  finalizeDisableOtp(
    payload: TransferFinalizeDisableOtpRequest,
  ): Promise<TransferControlResponse> {
    return this.executor.execute<TransferControlResponse>(
      `${this.transferBasePath}/disable_otp_finalize`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    )
  }

  /**
   * Enable OTP for transfer
   * @returns A promise resolving to the response
   * @see https://paystack.com/docs/api/transfer-control/#enable-otp
   */
  enableOtp(
    payload: TransferEnableOtpRequest,
  ): Promise<TransferControlResponse> {
    return this.executor.execute<TransferControlResponse>(
      `${this.transferBasePath}/enable_otp`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    )
  }

  /**
   * Get transfer balance
   * @returns A promise resolving to the balance response
   * @see https://paystack.com/docs/api/transfer-control/#check-balance
   */
  getBalance(): Promise<GetBalanceResponse> {
    return this.executor.execute<GetBalanceResponse>(this.balancePath, {
      method: 'GET',
    })
  }
}
