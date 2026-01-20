import type { ApiResponse } from '../base'

export interface VirtualAccountBank {
  name: string
  id: number
  slug: string
}

export interface VirtualAccountCustomer {
  id: number
  first_name: string
  last_name: string
  email: string
  customer_code: string
  phone: string
  risk_action: string
}

export interface VirtualAccountAssignment {
  integration: number
  assignee_id: number
  assignee_type: string
  expired: boolean
  account_type: string
  assigned_at: string
}

export interface VirtualAccount {
  id: number
  account_name: string
  account_number: string
  bank: VirtualAccountBank
  currency: string
  assigned: boolean
  active: boolean
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
  assignment: VirtualAccountAssignment
  customer: VirtualAccountCustomer
}

export interface AssignDedicatedVirtualAccountRequest {
  email?: string
  first_name?: string
  middle_name?: string
  last_name?: string
  phone?: string
  customer?: number | string
  preferred_bank: string
  country?: string
  account_number?: string
  bvn?: string
  bank_code?: string
  subaccount?: string
  split_code?: string
  metadata?: Record<string, unknown>
}

export type AssignDedicatedVirtualAccountResponse = ApiResponse<VirtualAccount>

export interface ListDedicatedVirtualAccountsQuery {
  active?: boolean
  currency?: string
  provider_slug?: string
  bank_id?: string
  customer?: string | number
  perPage?: number
  page?: number
}

export type ListDedicatedVirtualAccountsResponse = ApiResponse<VirtualAccount[]>

export interface RequeryDedicatedVirtualAccountRequest {
  account_number: string
  provider_slug: string
  date?: string
}

export type RequeryDedicatedVirtualAccountResponse = ApiResponse<unknown>
