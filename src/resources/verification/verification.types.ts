import type { ApiResponse } from '../base'

export interface ResolveAccountRequest {
  account_number: string
  bank_code: string
}

export interface ResolvedAccount {
  account_number: string
  account_name: string
  bank_id?: number
}

export type ResolveAccountResponse = ApiResponse<ResolvedAccount>

export interface ResolveBvnData {
  bvn: string
  calls_this_month?: number
  free_calls_left?: number
}

export type ResolveBvnResponse = ApiResponse<ResolveBvnData>

export interface MatchBvnRequest {
  account_number: string
  bank_code: string
  bvn: string
}

export interface MatchBvnResult {
  match: boolean
  account_number: string
  bank_code: string
  bvn: string
}

export type MatchBvnResponse = ApiResponse<MatchBvnResult>
