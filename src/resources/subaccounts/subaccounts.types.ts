import type { ApiResponse } from '../base'

export interface Subaccount {
  id: number
  business_name: string
  subaccount_code: string
  description?: string
  percentage_charge: number
  settlement_bank: string
  account_number: string
  active: boolean
  [key: string]: unknown
}

export interface CreateSubaccountRequest {
  business_name: string
  settlement_bank: string
  account_number: string
  percentage_charge: number
  description?: string
}

export type CreateSubaccountResponse = ApiResponse<Subaccount>

export interface UpdateSubaccountRequest {
  business_name?: string
  settlement_bank?: string
  account_number?: string
  percentage_charge?: number
  description?: string
}

export type UpdateSubaccountResponse = ApiResponse<Subaccount>

export type ListSubaccountsResponse = ApiResponse<Subaccount[]>

export type FetchSubaccountResponse = ApiResponse<Subaccount>
