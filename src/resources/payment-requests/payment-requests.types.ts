import type { ApiResponse, PaginationMetadata } from '../base'

export type PaymentRequestStatus =
  | 'pending'
  | 'paid'
  | 'cancelled'
  | 'overdue'
  | 'archived'

export interface PaymentRequest {
  id: number
  request_code: string
  description?: string | null
  amount: number
  currency: string
  status: PaymentRequestStatus
  paid: boolean
  email?: string | null
  customer?: Record<string, unknown> | null
  created_at: string
  updated_at: string
  due_date?: string | null
  line_items?: Array<Record<string, unknown>>
  tax?: Array<Record<string, unknown>>
}

export interface CreatePaymentRequestRequest {
  customer: string | number
  amount?: number
  currency?: string
  description?: string
  due_date?: string
  line_items?: Array<Record<string, unknown>>
  tax?: Array<Record<string, unknown>>
  send_notification?: boolean
}

export interface UpdatePaymentRequestRequest {
  customer?: string | number
  amount?: number
  currency?: string
  description?: string
  due_date?: string
  line_items?: Array<Record<string, unknown>>
  tax?: Array<Record<string, unknown>>
  send_notification?: boolean
}

export interface ListPaymentRequestsQuery {
  perPage?: number
  page?: number
  status?: PaymentRequestStatus
  from?: string
  to?: string
}

export interface ListPaymentRequestsResponse {
  data: PaymentRequest[]
  meta?: PaginationMetadata
}

export type ListPaymentRequestsApiResponse =
  ApiResponse<ListPaymentRequestsResponse>

export type GetPaymentRequestApiResponse = ApiResponse<PaymentRequest>

export interface PaymentRequestTotals {
  pending: number
  paid: number
  cancelled: number
  overdue: number
}

export type GetPaymentRequestTotalsApiResponse =
  ApiResponse<PaymentRequestTotals>

export interface VerifyPaymentRequestResponse {
  request_code: string
  status: PaymentRequestStatus
}

export type VerifyPaymentRequestApiResponse =
  ApiResponse<VerifyPaymentRequestResponse>
