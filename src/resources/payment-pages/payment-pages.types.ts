import type { ApiResponse, PaginationMetadata } from "../base"

export interface PaymentPage {
  id: number
  name: string
  description?: string | null
  amount?: number | null
  slug: string
  active: boolean
  currency?: string | null
  redirect_url?: string | null
  created_at: string
  updated_at: string
  custom_fields?: Array<Record<string, unknown>>
}

export interface CreatePaymentPageRequest {
  name: string
  description?: string
  amount?: number
  slug?: string
  currency?: string
  redirect_url?: string
  custom_fields?: Array<Record<string, unknown>>
}

export interface UpdatePaymentPageRequest {
  name?: string
  description?: string
  amount?: number
  active?: boolean
  redirect_url?: string
  custom_fields?: Array<Record<string, unknown>>
}

export interface ListPaymentPagesQuery {
  perPage?: number
  page?: number
  from?: string
  to?: string
}

export interface ListPaymentPagesResponse {
  data: PaymentPage[]
  meta?: PaginationMetadata
}

export type ListPaymentPagesApiResponse = ApiResponse<ListPaymentPagesResponse>

export type GetPaymentPageApiResponse = ApiResponse<PaymentPage>

export interface CheckSlugRequest {
  slug: string
}

export interface CheckSlugData {
  slug: string
  available: boolean
}

export type CheckSlugApiResponse = ApiResponse<CheckSlugData>
