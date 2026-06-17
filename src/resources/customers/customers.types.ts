import type { ApiResponse, PaginationMetadata } from '../base'

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
  from?: string | Date
  to?: string | Date
}

export interface ListCustomersResponse {
  customers: Customer[]
  meta?: PaginationMetadata
}

export interface ValidateCustomerRequest {
  first_name: string
  last_name: string
  type: string
  value: string
  country: string
  bvn: string
  bank_code: string
  account_number: string
}

export interface SetRiskActionRequest {
  customer: string
  risk_action: 'default' | 'allow' | 'deny'
}

export interface DeactivateAuthorizationRequest {
  authorization_code: string
}

export type CreateCustomerApiResponse = ApiResponse<Customer>

export type UpdateCustomerApiResponse = ApiResponse<Customer>

export type ListCustomersApiResponse = ApiResponse<Customer[]>

export type FetchCustomerApiResponse = ApiResponse<Customer>

export type ValidateCustomerApiResponse = ApiResponse<null>

export type SetRiskActionApiResponse = ApiResponse<Customer>

export type DeactivateAuthorizationApiResponse = ApiResponse<null>
