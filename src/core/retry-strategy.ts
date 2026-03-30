export interface RetryOptions {
  /**
   * Number of retries after the first attempt.
   *
   * Example: maxRetries = 2 means up to 3 total attempts (1 initial + 2 retries).
   */
  maxRetries?: number
  baseDelayMs?: number
  maxDelayMs?: number
  jitter?: boolean
}

const defaultRetryOptions: Required<RetryOptions> = {
  maxRetries: 3,
  baseDelayMs: 100,
  maxDelayMs: 2000,
  jitter: true,
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export async function executeWithRetry<T>(
  operation: () => Promise<T>,
  /**
   * Called after an attempt fails.
   *
   * attempt is 1-based (1 = first attempt, 2 = first retry attempt, etc).
   */
  shouldRetry: (error: unknown, attempt: number) => boolean,
  options: RetryOptions = {},
): Promise<T> {
  const merged: Required<RetryOptions> = {
    ...defaultRetryOptions,
    ...options,
  }

  let retries = 0

  for (;;) {
    const attempt = retries + 1

    try {
      return await operation()
    } catch (error) {
      const canRetry = retries < merged.maxRetries && shouldRetry(error, attempt)

      if (!canRetry) {
        throw error
      }

      const exponentialDelay = Math.min(
        merged.baseDelayMs * 2 ** (attempt - 1),
        merged.maxDelayMs,
      )

      const delay = merged.jitter
        ? Math.floor(Math.random() * (exponentialDelay + 1))
        : exponentialDelay

      retries += 1
      await sleep(delay)
    }
  }
}
