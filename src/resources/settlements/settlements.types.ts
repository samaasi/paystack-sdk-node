import type { ApiResponse } from "../base"
import type { Transaction } from "../transactions/transactions.types"

export type SettlementStatus = "success" | "processing" | "pending" | "failed"

export interface Settlement {
  id: number
  domain: string
  status: SettlementStatus
  currency: string
  integration: number
  total_amount: number
  effective_amount: number
  total_fees: number
  total_processed: number
  deductions: Record<string, unknown> | null
  settlement_date: string
  settled_by: string | null
  createdAt: string
  updatedAt: string
}

export interface ListSettlementsQuery {
  perPage?: number
  page?: number
  status?: SettlementStatus
  subaccount?: string
  from?: string
  to?: string
}

export interface ListSettlementTransactionsQuery {
  perPage?: number
  page?: number
  from?: string
  to?: string
}

export type ListSettlementsApiResponse = ApiResponse<Settlement[]>

export type ListSettlementTransactionsApiResponse = ApiResponse<Transaction[]>
