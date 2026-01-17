import type { ApiResponse } from "../base"

export type SplitType = "percentage" | "flat"

export type SplitBearerType =
  | "subaccount"
  | "account"
  | "all-proportional"
  | "all"

export interface SplitSubaccount {
  subaccount:
    | string
    | {
        id: number
        subaccount_code: string
        business_name: string
        description?: string | null
        primary_contact_name?: string | null
        primary_contact_email?: string | null
        primary_contact_phone?: string | null
        metadata?: Record<string, unknown> | null
        settlement_bank?: string | null
        currency?: string
        account_number?: string | null
      }
  share: number
}

export interface Split {
  id: number
  name: string
  type: SplitType
  currency: string
  integration: number
  domain: string
  split_code: string
  active: boolean
  bearer_type: SplitBearerType
  bearer_subaccount?: string | null
  createdAt: string
  updatedAt: string
  is_dynamic?: boolean
  subaccounts: SplitSubaccount[]
  total_subaccounts: number
}

export interface CreateSplitRequestSubaccount {
  subaccount: string
  share: number
}

export interface CreateSplitRequest {
  name: string
  type: SplitType
  currency: string
  subaccounts: CreateSplitRequestSubaccount[]
  bearer_type?: SplitBearerType
  bearer_subaccount?: string
}

export interface UpdateSplitRequest {
  name?: string
  active?: boolean
  bearer_type?: SplitBearerType
  bearer_subaccount?: string
}

export interface ListSplitsQuery {
  name?: string
  active?: boolean
  sort_by?: "name" | "createdAt"
  perPage?: number
  page?: number
  from?: string
  to?: string
}

export interface AddSubaccountRequest {
  subaccount: string
  share: number
}

export interface RemoveSubaccountRequest {
  subaccount: string
}

export type CreateSplitApiResponse = ApiResponse<Split>

export type GetSplitApiResponse = ApiResponse<Split>

export type ListSplitsApiResponse = ApiResponse<Split[]>

export type UpdateSplitApiResponse = ApiResponse<Split>

export type AddSubaccountApiResponse = ApiResponse<Split>

export type RemoveSubaccountApiResponse = ApiResponse<Split>
