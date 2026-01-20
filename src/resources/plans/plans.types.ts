import type { ApiResponse } from '../base'

export type PlanInterval =
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'biannually'
  | 'annually'

export type PlanStatus = 'active' | 'inactive'

export interface Plan {
  id: number
  name: string
  plan_code: string
  description?: string | null
  amount: number
  interval: PlanInterval
  send_invoices: boolean
  send_sms: boolean
  hosted_page: boolean
  hosted_page_url?: string | null
  hosted_page_summary?: string | null
  currency: string
  integration?: number
  domain?: string
  invoice_limit?: number | null
  createdAt: string
  updatedAt: string
}

export interface CreatePlanRequest {
  name: string
  interval: PlanInterval
  amount: number
  description?: string
  send_invoices?: boolean
  send_sms?: boolean
  hosted_page?: boolean
  invoice_limit?: number
  currency?: string
}

export interface UpdatePlanRequest {
  name?: string
  interval?: PlanInterval
  amount?: number
  description?: string
  send_invoices?: boolean
  send_sms?: boolean
  hosted_page?: boolean
  invoice_limit?: number
  currency?: string
}

export interface ListPlansQuery {
  perPage?: number
  page?: number
  status?: PlanStatus
  interval?: PlanInterval
  amount?: number
  from?: string
  to?: string
}

export type CreatePlanApiResponse = ApiResponse<Plan>

export type GetPlanApiResponse = ApiResponse<Plan>

export type ListPlansApiResponse = ApiResponse<Plan[]>

export type UpdatePlanApiResponse = ApiResponse<Plan>
