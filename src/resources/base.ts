import { RequestExecutor } from "../core/request-executor";

export interface BaseResourceOptions {
  executor: RequestExecutor
}

export interface PaginationMetadata {
  total: number
  perPage: number
  page: number
  pageCount: number
}

export interface ApiResponse<T> {
  status: boolean
  message: string
  data?: T | null
  meta?: PaginationMetadata
}

export class BaseResource {
  protected executor: RequestExecutor

  constructor(options: BaseResourceOptions) {
    this.executor = options.executor
  }
}
