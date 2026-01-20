import { PaystackClient } from "../src/index"
import { describe, expect, test, mock, beforeEach } from "bun:test"

describe("Paystack Resources", () => {
  const mockFetch = mock((url: any, init: any) => Promise.resolve(new Response(JSON.stringify({
    status: true,
    message: "Success",
    data: {}
  }))))

  let client: PaystackClient

  beforeEach(() => {
    mockFetch.mockClear()
    client = new PaystackClient({ 
      apiKey: "sk_test_123",
      fetchImpl: mockFetch as any 
    })
  })

  describe("Transactions", () => {
    test("initialize sends correct payload", async () => {
      await client.transactions.initialize({
        email: "test@example.com",
        amount: 500000
      })

      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/transaction/initialize")
      expect(init.method).toBe("POST")
      expect(JSON.parse(init.body as string)).toEqual({
        email: "test@example.com",
        amount: 500000
      })
    })

    test("verify calls correct endpoint", async () => {
      await client.transactions.verify("ref_123")

      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/transaction/verify/ref_123")
      expect(init.method).toBe("GET")
    })
  })

  describe("Customers", () => {
    test("create sends correct payload", async () => {
      await client.customers.create({
        email: "new@example.com",
        first_name: "John",
        last_name: "Doe"
      })

      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/customer")
      expect(init.method).toBe("POST")
      expect(JSON.parse(init.body as string)).toEqual({
        email: "new@example.com",
        first_name: "John",
        last_name: "Doe"
      })
    })

    test("list handles pagination params", async () => {
      await client.customers.list({ perPage: 20, page: 2 })

      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/customer?perPage=20&page=2")
    })
  })

  describe("Plans", () => {
    test("create sends correct payload", async () => {
      await client.plans.create({
        name: "Monthly Retainer",
        amount: 500000,
        interval: "monthly"
      })

      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/plan")
      expect(init.method).toBe("POST")
      expect(JSON.parse(init.body as string)).toEqual({
        name: "Monthly Retainer",
        amount: 500000,
        interval: "monthly"
      })
    })
  })

  describe("Transfers", () => {
    test("initiate sends correct payload", async () => {
      await client.transfers.initiate({
        source: "balance",
        amount: 50000,
        recipient: "RCP_gx2wn530m0i3w3m"
      })

      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/transfer")
      expect(init.method).toBe("POST")
      expect(JSON.parse(init.body as string)).toEqual({
        source: "balance",
        amount: 50000,
        recipient: "RCP_gx2wn530m0i3w3m"
      })
    })
  })

  describe("Verification", () => {
    test("resolveAccount sends correct query params", async () => {
      await client.verification.resolveAccount({
        account_number: "0001234567",
        bank_code: "058"
      })

      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/bank/resolve")
      expect(url).toContain("account_number=0001234567")
      expect(url).toContain("bank_code=058")
      expect(init.method).toBe("GET")
    })
  })
})
