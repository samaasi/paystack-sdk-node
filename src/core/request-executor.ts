import { ApiClient, type ApiClientOptions } from './api-client'

export interface RequestExecutorOptions extends ApiClientOptions {}

export class RequestExecutor {
  private client: ApiClient

  constructor(options: RequestExecutorOptions) {
    this.client = new ApiClient(options)
  }

  execute<T>(path: string, options: RequestInit = {}): Promise<T> {
    return this.client.request<T>(path, options)
  }
}
