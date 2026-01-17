import type { ApiResponse, PaginationMetadata } from "../base"

export interface CreateCustomerRequest {
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  metadata?: Record<string, unknown>
}

export interface UpdateCustomerRequest {
  first_name?: string
  last_name?: string
  phone?: string
  metadata?: Record<string, unknown>
}

export interface Customer {
  id: number
  first_name: string | null
  last_name: string | null
  email: string
  customer_code: string
  phone: string | null
  metadata?: Record<string, unknown> | null
  risk_action?: string
}

export interface ListCustomersQuery {
  perPage?: number
  page?: number
}

export interface ListCustomersResponse {
  customers: Customer[]
  meta?: PaginationMetadata
}

export type CreateCustomerApiResponse = ApiResponse<Customer>

export type UpdateCustomerApiResponse = ApiResponse<Customer>

export type ListCustomersApiResponse = ApiResponse<Customer[]>
