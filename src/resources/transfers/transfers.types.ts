import type { ApiResponse } from '../base'

export type TransferStatus = 'pending' | 'success' | 'failed' | 'otp' | 'queued'

export interface Transfer {
  id: number
  amount: number
  currency: string
  reference: string
  source: string
  reason: string | null
  status: TransferStatus
  failures: unknown | null
  transfer_code: string
  titan_code: string | null
  transferred_at: string | null
  recipient: number
  createdAt: string
  updatedAt: string
}

export interface InitiateTransferRequest {
  source: 'balance'
  amount: number
  recipient: string
  reference?: string
  reason?: string
  currency?: string
}

export type InitiateTransferResponse = ApiResponse<Transfer>

export interface FinalizeTransferRequest {
  transfer_code: string
  otp: string
}

export type FinalizeTransferResponse = ApiResponse<Transfer>
