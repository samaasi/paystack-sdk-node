import type { ApiResponse } from '../base'

export interface InitializeTransactionRequest {
  amount: number
  email: string
  currency?: string
  reference?: string
  callback_url?: string
  metadata?: Record<string, unknown>
  channels?: string[]
  plan?: string
  invoice_limit?: number
}

export interface TransactionCustomer {
  id: number
  first_name: string | null
  last_name: string | null
  email: string
  customer_code: string
}

export type TransactionStatus = 'pending' | 'success' | 'failed' | 'abandoned'

export interface Transaction {
  id: number
  amount: number
  currency: string
  status: TransactionStatus
  reference: string
  domain: string
  gateway_response: string
  paid_at: string | null
  created_at: string
  channel: string
  metadata?: Record<string, unknown> | null
  customer: TransactionCustomer
}

export interface InitializeTransactionResponse {
  authorization_url: string
  access_code: string
  reference: string
}

export type InitializeTransactionApiResponse =
  ApiResponse<InitializeTransactionResponse>

export type VerifyTransactionApiResponse = ApiResponse<Transaction>

export type FetchTransactionApiResponse = ApiResponse<Transaction>

export interface ListTransactionsQuery {
  perPage?: number
  page?: number
  customer?: number
  terminalid?: string
  status?: string
  failed?: boolean
  amount?: number
  from?: string | Date
  to?: string | Date
}

export type ListTransactionsApiResponse = ApiResponse<Transaction[]>

export interface ChargeAuthorizationRequest {
  amount: number
  email: string
  authorization_code: string
  reference?: string
  currency?: string
  metadata?: Record<string, unknown>
  channels?: string[]
  subaccount?: string
  transaction_charge?: number
  bearer?: string
  queue?: boolean
}

export type ChargeAuthorizationApiResponse = ApiResponse<Transaction>

export interface TransactionTimeline {
  time_spent: number
  attempts: number
  authentication: string | null
  errors: number
  success: boolean
  mobile: boolean
  input: any[]
  channel: string
  history: Array<{
    type: string
    message: string
    time: number
  }>
}

export type TransactionTimelineApiResponse = ApiResponse<TransactionTimeline>

export interface TransactionTotalsQuery {
  perPage?: number
  page?: number
  from?: string | Date
  to?: string | Date
}

export interface TransactionTotals {
  total_transactions: number
  unique_customers: number
  total_volume: number
  total_volume_by_currency: Array<{ currency: string; amount: number }>
  pending_transfers: number
  pending_transfers_by_currency: Array<{ currency: string; amount: number }>
}

export type TransactionTotalsApiResponse = ApiResponse<TransactionTotals>

export interface ExportTransactionsQuery {
  perPage?: number
  page?: number
  from?: string | Date
  to?: string | Date
  customer?: number
  status?: string
  currency?: string
  amount?: number
  settled?: boolean
  settlement?: number
  payment_page?: number
}

export interface ExportTransactions {
  path: string
}

export type ExportTransactionsApiResponse = ApiResponse<ExportTransactions>

export interface PartialDebitRequest {
  authorization_code: string
  currency: string
  amount: number
  email: string
  reference?: string
  at_least?: string
}

export type PartialDebitApiResponse = ApiResponse<Transaction>
