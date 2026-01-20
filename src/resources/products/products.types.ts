import type { ApiResponse, PaginationMetadata } from '../base'

export interface Product {
  id: number
  name: string
  description?: string | null
  product_code: string
  price: number
  currency: string
  quantity?: number | null
  status?: string
  created_at: string
  updated_at: string
}

export interface CreateProductRequest {
  name: string
  description?: string
  price: number
  currency?: string
  quantity?: number
}

export interface UpdateProductRequest {
  name?: string
  description?: string
  price?: number
  currency?: string
  quantity?: number
}

export interface ListProductsQuery {
  perPage?: number
  page?: number
  from?: string
  to?: string
}

export interface ListProductsResponse {
  data: Product[]
  meta?: PaginationMetadata
}

export type ListProductsApiResponse = ApiResponse<ListProductsResponse>

export type GetProductApiResponse = ApiResponse<Product>

export type CreateProductApiResponse = ApiResponse<Product>

export type UpdateProductApiResponse = ApiResponse<Product>
