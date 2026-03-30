import { describe, expect, test, mock } from 'bun:test'
import { StatusResource } from '../src/resources/status/status'

describe('StatusResource', () => {
  test('constructor throws when no fetch implementation is available', () => {
    const originalFetch = (globalThis as any).fetch

    try {
      // @ts-ignore
      globalThis.fetch = undefined
      expect(() => new StatusResource()).toThrow(
        'A fetch implementation is required to use StatusResource',
      )
    } finally {
      // @ts-ignore
      globalThis.fetch = originalFetch
    }
  })

  test('check returns parsed JSON', async () => {
    const fetchImpl = mock((_url: string, _init?: any) =>
      Promise.resolve({
        json: async () => ({
          status: { indicator: 'none', description: 'ok' },
        }),
      }),
    )

    const status = new StatusResource({
      fetchImpl: fetchImpl as any,
      baseUrl: 'https://status.paystack.com',
    })

    const result = await status.check()
    expect(result).toMatchObject({
      status: { indicator: 'none', description: 'ok' },
    })
  })

  test('check trims trailing slash in baseUrl', async () => {
    const fetchImpl = mock((url: string, _init?: any) =>
      Promise.resolve({
        json: async () => ({ url }),
      }),
    )

    const status = new StatusResource({
      fetchImpl: fetchImpl as any,
      baseUrl: 'https://status.paystack.com/',
    })

    const result = await status.check()
    expect((result as any).url).toBe('https://status.paystack.com/api/v2/summary.json')
  })

  test('check throws when response is missing json()', async () => {
    const fetchImpl = mock((_url: string, _init?: any) =>
      Promise.resolve({}),
    )

    const status = new StatusResource({ fetchImpl: fetchImpl as any })

    await expect(status.check()).rejects.toThrow(
      'Invalid response from Paystack status endpoint',
    )
  })

  test('check times out when timeoutMs is set', async () => {
    const fetchImpl = mock((_url: string, _init?: any) => new Promise(() => {}))
    const status = new StatusResource({ fetchImpl: fetchImpl as any, timeoutMs: 5 })

    await expect(status.check()).rejects.toThrow('Request timed out')
  })

  test('check aborts via external signal when timeoutMs is set', async () => {
    let capturedSignal: AbortSignal | undefined

    const fetchImpl = mock((_url: string, init?: any) => {
      capturedSignal = init?.signal
      return new Promise(() => {})
    })

    const status = new StatusResource({
      fetchImpl: fetchImpl as any,
      timeoutMs: 1000,
    })

    const controller = new AbortController()
    const promise = status.check({ signal: controller.signal })
    await Promise.resolve()
    controller.abort()

    await expect(promise).rejects.toThrow('Request aborted')
    expect(capturedSignal?.aborted).toBe(true)
  })

  test('check links external signal to internal signal when timeoutMs is set', async () => {
    let storedHandler: (() => void) | undefined
    let removedHandler: unknown

    const externalSignal = {
      aborted: false,
      addEventListener: (_type: string, handler: unknown) => {
        storedHandler = handler as any
      },
      removeEventListener: (_type: string, handler: unknown) => {
        removedHandler = handler
      },
    }

    const fetchImpl = mock((_url: string, _init?: any) => new Promise(() => {}))
    const status = new StatusResource({
      fetchImpl: fetchImpl as any,
      timeoutMs: 1000,
    })

    const promise = status.check({ signal: externalSignal as any })
    await Promise.resolve()
    externalSignal.aborted = true
    storedHandler?.()

    await expect(promise).rejects.toThrow('Request aborted')
    expect(removedHandler).toBe(storedHandler)
  })

  test('check aborts (not timeout) when signal is already aborted and timeoutMs is set', async () => {
    const fetchImpl = mock((_url: string, _init?: any) => new Promise(() => {}))
    const status = new StatusResource({ fetchImpl: fetchImpl as any, timeoutMs: 1000 })

    const controller = new AbortController()
    controller.abort()

    await expect(status.check({ signal: controller.signal })).rejects.toThrow(
      'Request aborted',
    )
  })

  test('check aborts when signal is aborted', async () => {
    const fetchImpl = mock((_url: string, _init?: any) => new Promise(() => {}))
    const status = new StatusResource({ fetchImpl: fetchImpl as any })

    const controller = new AbortController()
    const promise = status.check({ signal: controller.signal })
    controller.abort()

    await expect(promise).rejects.toThrow('Request aborted')
  })

  test('check aborts when signal is already aborted', async () => {
    const fetchImpl = mock((_url: string, _init?: any) => new Promise(() => {}))
    const status = new StatusResource({ fetchImpl: fetchImpl as any })

    const controller = new AbortController()
    controller.abort()

    await expect(status.check({ signal: controller.signal })).rejects.toThrow(
      'Request aborted',
    )
  })
})

