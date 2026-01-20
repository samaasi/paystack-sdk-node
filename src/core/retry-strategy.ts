export interface RetryOptions {
  maxRetries?: number
  baseDelayMs?: number
  maxDelayMs?: number
}

const defaultRetryOptions: Required<RetryOptions> = {
  maxRetries: 3,
  baseDelayMs: 100,
  maxDelayMs: 2000,
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export async function executeWithRetry<T>(
  operation: () => Promise<T>,
  shouldRetry: (error: unknown, attempt: number) => boolean,
  options: RetryOptions = {},
): Promise<T> {
  const merged: Required<RetryOptions> = {
    ...defaultRetryOptions,
    ...options,
  }

  let attempt = 0

  for (;;) {
    attempt += 1

    try {
      return await operation()
    } catch (error) {
      const canRetry =
        attempt <= merged.maxRetries && shouldRetry(error, attempt)

      if (!canRetry) {
        throw error
      }

      const delay = Math.min(
        merged.baseDelayMs * 2 ** (attempt - 1),
        merged.maxDelayMs,
      )
      await sleep(delay)
    }
  }
}
