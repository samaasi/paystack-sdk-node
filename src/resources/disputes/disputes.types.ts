import type { ApiResponse, PaginationMetadata } from '../base'

export type DisputeStatus =
  | 'waiting_evidence'
  | 'review'
  | 'resolved'
  | 'rejected'
  | 'chargeback'
  | 'settled'

export interface DisputeCustomer {
  id: number
  customer_code: string
  email: string
}

export interface Dispute {
  id: number
  status: DisputeStatus
  amount: number
  currency: string
  transaction: number
  reference?: string
  reason?: string
  created_at: string
  updated_at: string
  customer?: DisputeCustomer
  evidence?: Record<string, unknown> | null
}

export interface ListDisputesQuery {
  perPage?: number
  page?: number
  status?: DisputeStatus
  from?: string
  to?: string
  transaction?: number
  amount?: number
}

export interface ListDisputesResponse {
  data: Dispute[]
  meta?: PaginationMetadata
}

export type ListDisputesApiResponse = ApiResponse<ListDisputesResponse>

export type GetDisputeApiResponse = ApiResponse<Dispute>

export interface ListTransactionDisputesResponse {
  disputes: Dispute[]
}

export type ListTransactionDisputesApiResponse =
  ApiResponse<ListTransactionDisputesResponse>

export interface SubmitEvidenceRequest {
  customer_email?: string
  customer_name?: string
  customer_phone?: string
  service_details?: string
  delivery_address?: string
  delivery_date?: string
  refund_amount?: number
  uploaded_filename?: string
  evidence?: Record<string, unknown>
}

export type SubmitEvidenceApiResponse = ApiResponse<Dispute>

export interface GetUploadUrlResponse {
  upload_url: string
  upload_filename: string
}

export type GetUploadUrlApiResponse = ApiResponse<GetUploadUrlResponse>
