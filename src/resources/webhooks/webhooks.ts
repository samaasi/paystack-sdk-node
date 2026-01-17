import type { WebhookEvent } from "./webhooks.types"

export function isWebhookEvent(value: unknown): value is WebhookEvent {
  if (!value || typeof value !== "object") {
    return false
  }

  const record = value as Record<string, unknown>

  if (typeof record.event !== "string") {
    return false
  }

  if (!("data" in record)) {
    return false
  }

  return true
}
