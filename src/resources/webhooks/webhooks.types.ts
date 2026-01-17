export interface WebhookEvent<T = unknown> {
  event: string
  data: T
  [key: string]: unknown
}
