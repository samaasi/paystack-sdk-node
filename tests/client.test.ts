import { PaystackClient, createPaystackClient } from "../src/index"
import { describe, expect, test, mock, beforeEach, afterEach } from "bun:test"

describe("PaystackClient", () => {
  const mockFetch = mock((url: any, init: any) => Promise.resolve(new Response(JSON.stringify({
    status: true,
    message: "Success",
    data: { id: 1, domain_name: "example.com" }
  }))))

  beforeEach(() => {
    mockFetch.mockClear()
  })

  test("instantiates correctly with API key", () => {
    const client = new PaystackClient({ apiKey: "sk_test_123" })
    expect(client).toBeDefined()
    expect(client.applePay).toBeDefined()
  })

  test("createPaystackClient helper works", async () => {
    process.env.PAYSTACK_SECRET_KEY = "sk_env_helper"
    const client = await createPaystackClient()
    expect(client).toBeDefined()
    // We can't easily check internal state, but instantiation without error is good
    delete process.env.PAYSTACK_SECRET_KEY
  })

  test("Apple Pay resource makes correct request", async () => {
    const client = new PaystackClient({ 
      apiKey: "sk_test_123",
      fetchImpl: mockFetch as any 
    })

    await client.applePay.listDomains()

    expect(mockFetch).toHaveBeenCalledTimes(1)
    const [url, init] = mockFetch.mock.calls[0]!
    
    expect(url).toContain("/apple-pay/domain")
    expect(init.method).toBe("GET")
    expect(init.headers).toEqual(expect.objectContaining({
      "Authorization": "Bearer sk_test_123",
      "Content-Type": "application/json"
    }))
  })

  test("uses custom base URL", async () => {
    const client = new PaystackClient({ 
      apiKey: "sk_test_123",
      baseUrl: "https://custom-api.paystack.co",
      fetchImpl: mockFetch as any
    })

    await client.applePay.listDomains()
    
    const [url] = mockFetch.mock.calls[0]!
    expect(url).toContain("https://custom-api.paystack.co")
  })
})
