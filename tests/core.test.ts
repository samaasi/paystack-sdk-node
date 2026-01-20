
import { ApiClient } from "../src/core/api-client"
import { loadPaystackConfig } from "../src/core/config"
import { executeWithRetry } from "../src/core/retry-strategy"
import { PaystackError, PaystackAuthenticationError, PaystackServerError, PaystackValidationError, PaystackRateLimitError, PaystackNetworkError, mapPaystackHttpError, mapNetworkError } from "../src/core/error-handler"
import { describe, expect, test, mock, beforeEach, afterEach } from "bun:test"

describe("Core", () => {
  describe("ApiClient", () => {
    const mockFetch = mock((url: any, init: any) => Promise.resolve(new Response(JSON.stringify({ status: true, data: {} }))))
    let client: ApiClient

    beforeEach(() => {
      mockFetch.mockClear()
      client = new ApiClient({
        apiKey: "sk_test_123",
        fetchImpl: mockFetch as any
      })
    })

    test("request sends correct headers", async () => {
      await client.request("/test")
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toBe("https://api.paystack.co/test")
      expect(init.headers).toEqual({
        Authorization: "Bearer sk_test_123",
        "Content-Type": "application/json"
      })
    })

    test("request handles extra headers", async () => {
      await client.request("/test", { headers: { "X-Custom": "value" } })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(init.headers).toEqual({
        Authorization: "Bearer sk_test_123",
        "Content-Type": "application/json",
        "X-Custom": "value"
      })
    })

    test("request handles HTTP errors", async () => {
      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({ message: "Bad Request" }), { status: 400 }))
      try {
        await client.request("/test")
        expect(true).toBe(false) // Should not reach here
      } catch (error) {
        expect(error).toBeInstanceOf(PaystackValidationError)
        expect((error as any).status).toBe(400)
      }
    })

    test("request retries on server errors", async () => {
      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({}), { status: 502 }))
      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({ status: true, data: {} })))

      await client.request("/test")
      expect(mockFetch).toHaveBeenCalledTimes(2)
    })

    test("request does not retry on 4xx errors", async () => {
      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({}), { status: 400 }))
      mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({ status: true, data: {} })))

      try {
        await client.request("/test")
      } catch (error) {
        expect(mockFetch).toHaveBeenCalledTimes(1)
        expect(error).toBeInstanceOf(PaystackValidationError)
      }
    })

    test("helper methods call request with correct method", async () => {
      await client.get("/test")
      expect(mockFetch.mock.calls[0]![1].method).toBe("GET")
      mockFetch.mockClear()

      await client.post("/test", { foo: "bar" })
      expect(mockFetch.mock.calls[0]![1].method).toBe("POST")
      expect(mockFetch.mock.calls[0]![1].body).toBe(JSON.stringify({ foo: "bar" }))
      mockFetch.mockClear()

      await client.put("/test", { foo: "baz" })
      expect(mockFetch.mock.calls[0]![1].method).toBe("PUT")
      mockFetch.mockClear()

      await client.delete("/test")
      expect(mockFetch.mock.calls[0]![1].method).toBe("DELETE")
    })
  })

  describe("ErrorHandler", () => {
    test("mapPaystackHttpError maps 401 to AuthenticationError", () => {
      const error = mapPaystackHttpError(401, { message: "Auth failed" })
      expect(error).toBeInstanceOf(PaystackAuthenticationError)
      expect(error.message).toBe("Auth failed")
    })

    test("mapPaystackHttpError maps 429 to RateLimitError", () => {
      const error = mapPaystackHttpError(429, { message: "Too many requests" })
      expect(error).toBeInstanceOf(PaystackRateLimitError)
    })

    test("mapPaystackHttpError maps 500 to ServerError", () => {
      const error = mapPaystackHttpError(500, { message: "Server error" })
      expect(error).toBeInstanceOf(PaystackServerError)
    })

    test("mapPaystackHttpError maps default to APIError", () => {
      const error = mapPaystackHttpError(418, { message: "Teapot" })
      expect(error).toBeInstanceOf(PaystackValidationError) // 400-499 -> ValidationError
    })

    test("mapNetworkError maps unknown error", () => {
      const error = mapNetworkError(new Error("Network fail"))
      expect(error).toBeInstanceOf(PaystackNetworkError)
      expect(error.message).toBe("Network fail")
    })
  })

  describe("RetryStrategy", () => {
    test("executeWithRetry retries on failure", async () => {
      let attempts = 0
      const operation = async () => {
        attempts++
        if (attempts < 2) throw new Error("Fail")
        return "Success"
      }
      const shouldRetry = () => true

      const result = await executeWithRetry(operation, shouldRetry, { baseDelayMs: 1 })
      expect(result).toBe("Success")
      expect(attempts).toBe(2)
    })

    test("executeWithRetry fails after max retries", async () => {
      let attempts = 0
      const operation = async () => {
        attempts++
        throw new Error("Fail")
      }
      const shouldRetry = () => true

      try {
        await executeWithRetry(operation, shouldRetry, { maxRetries: 2, baseDelayMs: 1 })
      } catch (error) {
        expect((error as Error).message).toBe("Fail")
        expect(attempts).toBe(3) // Initial + 2 retries
      }
    })
  })

  describe("Config", () => {
    const originalApiKey = process.env.PAYSTACK_SECRET_KEY

    afterEach(() => {
      if (originalApiKey) {
        process.env.PAYSTACK_SECRET_KEY = originalApiKey
      } else {
        delete process.env.PAYSTACK_SECRET_KEY
      }
    })

    test("loadPaystackConfig loads from process.env", async () => {
      process.env.PAYSTACK_SECRET_KEY = "sk_env_123"
      const config = await loadPaystackConfig()
      expect(config.apiKey).toBe("sk_env_123")
    })

    test("loadPaystackConfig throws if no apiKey", async () => {
      delete process.env.PAYSTACK_SECRET_KEY
      try {
        await loadPaystackConfig()
        expect(true).toBe(false)
      } catch (error) {
        expect((error as Error).message).toContain("Missing Paystack API key")
      }
    })

    test("loadPaystackConfig uses overrides", async () => {
      const config = await loadPaystackConfig({ overrides: { apiKey: "sk_override" } })
      expect(config.apiKey).toBe("sk_override")
    })

    test("loadPaystackConfig reads from .env file", async () => {
      const envPath = ".env.test.tmp"
      await Bun.write(envPath, "PAYSTACK_SECRET_KEY=sk_file_123\nPAYSTACK_BASE_URL=https://file.com")
      
      try {
        const config = await loadPaystackConfig({ envFilePath: envPath })
        expect(config.apiKey).toBe("sk_file_123")
        expect(config.baseUrl).toBe("https://file.com")
      } finally {
        const fs = await import("node:fs/promises")
        await fs.unlink(envPath)
      }
    })

    test("loadPaystackConfig handles quoted values in .env file", async () => {
      const envPath = ".env.quoted.tmp"
      await Bun.write(envPath, 'PAYSTACK_SECRET_KEY="sk_quoted_123"')
      
      try {
        const config = await loadPaystackConfig({ envFilePath: envPath })
        expect(config.apiKey).toBe("sk_quoted_123")
      } finally {
        const fs = await import("node:fs/promises")
        await fs.unlink(envPath)
      }
    })
  })
})
