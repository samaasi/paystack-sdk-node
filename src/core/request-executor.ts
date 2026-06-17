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

  get<T>(path: string, options: RequestInit = {}): Promise<T> {
    return this.client.get<T>(path, options)
  }

  post<T, B = unknown>(path: string, body?: B, options: RequestInit = {}): Promise<T> {
    return this.client.post<T, B>(path, body, options)
  }

  put<T, B = unknown>(path: string, body?: B, options: RequestInit = {}): Promise<T> {
    return this.client.put<T, B>(path, body, options)
  }

  delete<T, B = unknown>(path: string, body?: B, options: RequestInit = {}): Promise<T> {
    return this.client.delete<T, B>(path, body, options)
  }
}
