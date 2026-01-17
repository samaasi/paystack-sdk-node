import { BaseResource } from "../base"
import type {
  GetBalanceResponse,
  TransferControlResponse,
  TransferEnableOtpRequest,
  TransferResendOtpRequest,
  TransferDisableOtpRequest,
  TransferFinalizeDisableOtpRequest,
} from "./transfer-control.types"

export class TransferControlResource extends BaseResource {
  private readonly transferBasePath = "/transfer"
  private readonly balancePath = "/balance"

  resendOtp(
    payload: TransferResendOtpRequest,
  ): Promise<TransferControlResponse> {
    return this.executor.execute<TransferControlResponse>(
      `${this.transferBasePath}/resend_otp`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    )
  }

  disableOtp(
    payload: TransferDisableOtpRequest,
  ): Promise<TransferControlResponse> {
    return this.executor.execute<TransferControlResponse>(
      `${this.transferBasePath}/disable_otp`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    )
  }

  finalizeDisableOtp(
    payload: TransferFinalizeDisableOtpRequest,
  ): Promise<TransferControlResponse> {
    return this.executor.execute<TransferControlResponse>(
      `${this.transferBasePath}/disable_otp_finalize`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    )
  }

  enableOtp(
    payload: TransferEnableOtpRequest,
  ): Promise<TransferControlResponse> {
    return this.executor.execute<TransferControlResponse>(
      `${this.transferBasePath}/enable_otp`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    )
  }

  getBalance(): Promise<GetBalanceResponse> {
    return this.executor.execute<GetBalanceResponse>(this.balancePath, {
      method: "GET",
    })
  }
}
