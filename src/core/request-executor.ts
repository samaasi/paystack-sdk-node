import { ApiClient, type ApiClientOptions, type RequestInitLike } from './api-client'

export interface RequestExecutorOptions extends ApiClientOptions {}

export class RequestExecutor {
  private client: ApiClient

  constructor(options: RequestExecutorOptions) {
    this.client = new ApiClient(options)
  }

  execute<T>(path: string, options: RequestInitLike = {}): Promise<T> {
    return this.client.request<T>(path, options)
  }
}
