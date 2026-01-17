import type { ApiResponse } from "../base"

export interface PaymentSessionTimeoutData {
  payment_session_timeout: number
}

export type GetPaymentSessionTimeoutResponse =
  ApiResponse<PaymentSessionTimeoutData>

export interface UpdatePaymentSessionTimeoutRequest {
  timeout: number
}

export type UpdatePaymentSessionTimeoutResponse =
  ApiResponse<PaymentSessionTimeoutData>
