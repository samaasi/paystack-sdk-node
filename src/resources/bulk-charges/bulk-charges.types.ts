import type { ApiResponse, PaginationMetadata } from "../base"

export type BulkChargeStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "paused"

export interface BulkChargeItem {
  id: number
  reference?: string
  amount: number
  currency: string
  status: string
  created_at: string
  updated_at: string
  customer?: Record<string, unknown>
}

export interface BulkChargeBatch {
  id: number
  batch_code: string
  status: BulkChargeStatus
  created_at: string
  updated_at: string
}

export interface CreateBulkChargeItem {
  authorization: string
  amount: number
  reference?: string
}

export interface CreateBulkChargeRequest {
  batch: CreateBulkChargeItem[]
}

export type CreateBulkChargeApiResponse = ApiResponse<BulkChargeBatch>

export interface ListBulkChargeBatchesQuery {
  perPage?: number
  page?: number
  status?: BulkChargeStatus
  from?: string
  to?: string
}

export interface ListBulkChargeBatchesResponse {
  data: BulkChargeBatch[]
  meta?: PaginationMetadata
}

export type ListBulkChargeBatchesApiResponse =
  ApiResponse<ListBulkChargeBatchesResponse>

export type GetBulkChargeBatchApiResponse = ApiResponse<BulkChargeBatch>

export interface ListBulkChargeItemsQuery {
  perPage?: number
  page?: number
  status?: string
}

export interface ListBulkChargeItemsResponse {
  data: BulkChargeItem[]
  meta?: PaginationMetadata
}

export type ListBulkChargeItemsApiResponse =
  ApiResponse<ListBulkChargeItemsResponse>
