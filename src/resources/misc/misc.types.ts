import type { ApiResponse } from '../base'
import type {
  ResolveAccountRequest,
  ResolveAccountResponse,
} from '../verification/verification.types'

export interface Bank {
  name: string
  slug: string
  code: string
  longcode?: string | null
  gateway?: string | null
  pay_with_bank?: boolean
  active?: boolean
  is_deleted?: boolean | null
  country?: string
  currency?: string
  type?: string | null
  id?: number
}

export interface ListBanksQuery {
  country?: string
  type?: string
}

export type ListBanksResponse = ApiResponse<Bank[]>

export interface Country {
  name: string
  iso_code: string
  default_currency?: string
  currency?: string
  calling_code?: string
}

export type ListCountriesResponse = ApiResponse<Country[]>

export interface State {
  name: string
  abbreviation?: string
  code?: string
}

export type ListStatesResponse = ApiResponse<State[]>

export interface CardBinData {
  bin: string
  brand?: string | null
  sub_brand?: string | null
  country_code?: string | null
  country_name?: string | null
  card_type?: string | null
  bank?: string | null
  linked_bank_id?: number | null
}

export type ResolveCardBinResponse = ApiResponse<CardBinData>

export type ResolveAccountLookupRequest = ResolveAccountRequest

export type ResolveAccountLookupResponse = ResolveAccountResponse
