import type { ApiResponse } from "../base"

export type ChargeStatus =
  | "pending"
  | "success"
  | "failed"
  | "timeout"
  | "send_pin"
  | "send_otp"
  | "send_phone"
  | "send_birthday"
  | "send_address"
  | "open_url"
  | "pay_offline"

export interface ChargeCardDetails {
  cvv: string
  number: string
  expiry_month: string
  expiry_year: string
}

export interface ChargeBankDetails {
  code: string
  account_number?: string
  phone?: string
  token?: string
}

export interface ChargeMobileMoneyDetails {
  phone: string
  provider: string
}

export interface CreateChargeBase {
  email: string
  amount: number | string
  metadata?: Record<string, unknown>
  currency?: string
  reference?: string
  use_hosted_url?: boolean
}

export type CreateChargeRequest =
  | (CreateChargeBase & { card: ChargeCardDetails; pin?: string })
  | (CreateChargeBase & { bank: ChargeBankDetails; birthday?: string })
  | (CreateChargeBase & { mobile_money: ChargeMobileMoneyDetails })

export interface ChargeResponseData {
  reference: string
  status: ChargeStatus
  display_text?: string
  url?: string
  ussd_code?: string
}

export type CreateChargeApiResponse = ApiResponse<ChargeResponseData>

export interface SubmitOtpRequest {
  reference: string
  otp: string
}

export type SubmitOtpApiResponse = ApiResponse<ChargeResponseData>

export interface SubmitPinRequest {
  reference: string
  pin: string
}

export type SubmitPinApiResponse = ApiResponse<ChargeResponseData>

export interface SubmitPhoneRequest {
  reference: string
  phone: string
}

export type SubmitPhoneApiResponse = ApiResponse<ChargeResponseData>

export interface SubmitBirthdayRequest {
  reference: string
  birthday: string
}

export type SubmitBirthdayApiResponse = ApiResponse<ChargeResponseData>

export interface SubmitAddressRequest {
  reference: string
  address: string
  city: string
  state: string
  zipcode: string
}

export type SubmitAddressApiResponse = ApiResponse<ChargeResponseData>

export interface CheckPendingChargeResponse {
  reference: string
  status: ChargeStatus
}

export type CheckPendingChargeApiResponse =
  ApiResponse<CheckPendingChargeResponse>
