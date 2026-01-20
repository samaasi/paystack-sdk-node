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

    test("list handles query params", async () => {
      await client.plans.list({ status: "active", interval: "monthly" })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/plan")
      expect(url).toContain("status=active")
      expect(url).toContain("interval=monthly")
    })

    test("get calls correct endpoint", async () => {
      await client.plans.get("PLN_123")
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/plan/PLN_123")
    })

    test("update sends correct payload", async () => {
      await client.plans.update("PLN_123", { name: "New Name" })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/plan/PLN_123")
      expect(init.method).toBe("PUT")
      expect(JSON.parse(init.body as string)).toEqual({ name: "New Name" })
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

    test("finalize sends correct payload", async () => {
      await client.transfers.finalize({ transfer_code: "TRF_123", otp: "123456" })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/transfer/finalize_transfer")
      expect(init.method).toBe("POST")
      expect(JSON.parse(init.body as string)).toEqual({ transfer_code: "TRF_123", otp: "123456" })
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

    test("resolveBvn calls correct endpoint", async () => {
      await client.verification.resolveBvn("12345678901")
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/bank/resolve_bvn/12345678901")
    })

    test("matchBvn sends correct query params", async () => {
      await client.verification.matchBvn({
        account_number: "0001234567",
        bank_code: "058",
        bvn: "12345678901"
      })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/bank/match_bvn")
      expect(url).toContain("account_number=0001234567")
      expect(url).toContain("bank_code=058")
      expect(url).toContain("bvn=12345678901")
    })
  })

  describe("Apple Pay", () => {
    test("registerDomain sends correct payload", async () => {
      await client.applePay.registerDomain({ domainName: "example.com" })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/apple-pay/domain")
      expect(init.method).toBe("POST")
      expect(JSON.parse(init.body as string)).toEqual({ domainName: "example.com" })
    })

    test("unregisterDomain sends correct payload", async () => {
      await client.applePay.unregisterDomain({ domainName: "example.com" })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/apple-pay/domain")
      expect(init.method).toBe("DELETE")
      expect(JSON.parse(init.body as string)).toEqual({ domainName: "example.com" })
    })
  })
})
