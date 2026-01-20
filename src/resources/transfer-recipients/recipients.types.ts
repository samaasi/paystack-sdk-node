import type { ApiResponse } from '../base'

export type TransferRecipientType =
  | 'nuban'
  | 'ghipss'
  | 'mobile_money'
  | 'kepss'
  | 'basa'
  | 'authorization'

export interface CreateTransferRecipientRequest {
  type: TransferRecipientType
  name: string
  account_number?: string
  bank_code?: string
  currency?: string
  email?: string
  metadata?: Record<string, unknown>
}

export interface UpdateTransferRecipientRequest {
  name?: string
  email?: string
  metadata?: Record<string, unknown>
}

export interface TransferRecipient {
  recipient_code: string
  name: string
  type: TransferRecipientType
  currency: string
  details: Record<string, unknown>
  active: boolean
  id: number
}

export type CreateTransferRecipientResponse = ApiResponse<TransferRecipient>

export type UpdateTransferRecipientResponse = ApiResponse<TransferRecipient>

export type FetchTransferRecipientResponse = ApiResponse<TransferRecipient>

export type ListTransferRecipientsResponse = ApiResponse<TransferRecipient[]>
