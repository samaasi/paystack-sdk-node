import type { ApiResponse } from "../base"

export type RefundStatus =
  | "pending"
  | "processing"
  | "processed"
  | "failed"
  | "needs-attention"

export interface Refund {
  id: number
  integration: number
  transaction: number
  dispute: number | null
  settlement: number | null
  amount: number
  deducted_amount: number
  currency: string
  status: RefundStatus
  channel?: string | null
  fully_deducted: boolean
  refunded_by?: string | null
  refunded_at?: string | null
  expected_at?: string | null
  customer_note?: string | null
  merchant_note?: string | null
  domain?: string
  created_at: string
  updated_at: string
}

export interface CreateRefundRequest {
  transaction: number | string
  amount?: number
  customer_note?: string
  merchant_note?: string
}

export interface RetryRefundAccountDetails {
  currency: string
  account_number: string
  bank_id: string | number
}

export interface RetryRefundRequest {
  refund_account_details: RetryRefundAccountDetails
}

export interface ListRefundsQuery {
  transaction?: number
  from?: string
  to?: string
  perPage?: number
  page?: number
}

export type CreateRefundApiResponse = ApiResponse<Refund>

export type GetRefundApiResponse = ApiResponse<Refund>

export type ListRefundsApiResponse = ApiResponse<Refund[]>

export type RetryRefundApiResponse = ApiResponse<Refund>
