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

export type RequeryTransactionApiResponse = ApiResponse<Transaction>
