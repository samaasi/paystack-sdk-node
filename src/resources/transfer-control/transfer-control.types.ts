import type { ApiResponse } from "../base"

export interface TransferResendOtpRequest {
  transfer_code: string
  reason?: string
}

export interface TransferDisableOtpRequest {
  reason?: string
}

export interface TransferFinalizeDisableOtpRequest {
  otp: string
}

export interface TransferEnableOtpRequest {
  otp: string
}

export interface TransferControlResult {
  [key: string]: unknown
}

export type TransferControlResponse = ApiResponse<TransferControlResult | null>

export interface Balance {
  currency: string
  balance: number
}

export type GetBalanceResponse = ApiResponse<Balance[]>
