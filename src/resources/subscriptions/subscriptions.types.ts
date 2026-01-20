import type { ApiResponse } from '../base'

export type SubscriptionStatus =
  | 'active'
  | 'non-renewing'
  | 'completed'
  | 'cancelled'

export interface Subscription {
  id: number
  customer: number | string
  plan: number | string
  status: SubscriptionStatus
  quantity: number
  amount: number
  authorization: Record<string, unknown>
  start: number
  domain: string
  integration: number
  createdAt: string
  updatedAt: string
}

export interface CreateSubscriptionRequest {
  customer: string
  plan: string
  authorization?: string
}

export type CreateSubscriptionResponse = ApiResponse<Subscription>

export type FetchSubscriptionResponse = ApiResponse<Subscription>

export type ListSubscriptionsResponse = ApiResponse<Subscription[]>
