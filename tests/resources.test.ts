import { PaystackClient, isWebhookEvent } from "../src/index"
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

    test("requery calls correct endpoint", async () => {
      await client.transactions.requery(123)

      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/transaction/123")
      expect(init.method).toBe("GET")
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

  describe("Products", () => {
    test("create sends correct payload", async () => {
      const payload = {
        name: "Product A",
        description: "Desc",
        price: 5000,
        currency: "NGN"
      }
      await client.products.create(payload)
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/product")
      expect(init.method).toBe("POST")
      expect(JSON.parse(init.body as string)).toEqual(payload)
    })

    test("list handles query params", async () => {
      await client.products.list({ page: 1, perPage: 20 })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/product")
      expect(url).toContain("page=1")
      expect(url).toContain("perPage=20")
    })

    test("get calls correct endpoint", async () => {
      await client.products.get(123)
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/product/123")
    })

    test("update sends correct payload", async () => {
      await client.products.update(123, { name: "Updated Product" })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/product/123")
      expect(init.method).toBe("PUT")
      expect(JSON.parse(init.body as string)).toEqual({ name: "Updated Product" })
    })
  })

  describe("Refunds", () => {
    test("create sends correct payload", async () => {
      const payload = { transaction: "ref_123", amount: 5000 }
      await client.refunds.create(payload)
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/refund")
      expect(init.method).toBe("POST")
      expect(JSON.parse(init.body as string)).toEqual(payload)
    })

    test("list handles query params", async () => {
      await client.refunds.list({ transaction: "ref_123" })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/refund")
      expect(url).toContain("transaction=ref_123")
    })

    test("get calls correct endpoint", async () => {
      await client.refunds.get("ref_123")
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/refund/ref_123")
    })

    test("retry sends correct payload", async () => {
      const payload = {
        refund_account_details: {
          currency: "NGN",
          account_number: "0000000000",
          bank_id: "057",
        },
      }
      await client.refunds.retry("ref_123", payload)
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/refund/retry_with_customer_details/ref_123")
      expect(init.method).toBe("POST")
      expect(JSON.parse(init.body as string)).toEqual(payload)
    })
  })

  describe("Settlements", () => {
    test("list handles query params", async () => {
      await client.settlements.list({ status: "success" })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/settlement")
      expect(url).toContain("status=success")
    })

    test("listTransactions calls correct endpoint", async () => {
      await client.settlements.listTransactions(123)
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/settlement/123/transactions")
    })
  })

  describe("Splits", () => {
    test("create sends correct payload", async () => {
      const payload: any = {
        name: "Split A",
        type: "percentage",
        currency: "NGN",
        subaccounts: [{ subaccount: "SUB_123", share: 50 }]
      }
      await client.splits.create(payload)
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/split")
      expect(init.method).toBe("POST")
      expect(JSON.parse(init.body as string)).toEqual(payload)
    })

    test("list handles query params", async () => {
      await client.splits.list({ active: true })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/split")
      expect(url).toContain("active=true")
    })

    test("get calls correct endpoint", async () => {
      await client.splits.get(123)
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/split/123")
    })

    test("update sends correct payload", async () => {
      await client.splits.update(123, { name: "Updated Split" })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/split/123")
      expect(init.method).toBe("PUT")
      expect(JSON.parse(init.body as string)).toEqual({ name: "Updated Split" })
    })

    test("addSubaccount sends correct payload", async () => {
      await client.splits.addSubaccount(123, { subaccount: "SUB_123", share: 20 })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/split/123/subaccount/add")
      expect(init.method).toBe("POST")
      expect(JSON.parse(init.body as string)).toEqual({ subaccount: "SUB_123", share: 20 })
    })

    test("removeSubaccount sends correct payload", async () => {
      await client.splits.removeSubaccount(123, { subaccount: "SUB_123" })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/split/123/subaccount/remove")
      expect(init.method).toBe("POST")
      expect(JSON.parse(init.body as string)).toEqual({ subaccount: "SUB_123" })
    })
  })

  describe("Status", () => {
    test("check calls correct endpoint", async () => {
      await client.status.check()
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("https://status.paystack.com/api/v2/summary.json")
      expect(init.method).toBe("GET")
    })
  })

  describe("Subaccounts", () => {
    test("create sends correct payload", async () => {
      const payload = {
        business_name: "Biz Name",
        settlement_bank: "058",
        account_number: "0001234567",
        percentage_charge: 10
      }
      await client.subaccounts.create(payload)
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/subaccount")
      expect(init.method).toBe("POST")
      expect(JSON.parse(init.body as string)).toEqual(payload)
    })

    test("list calls correct endpoint", async () => {
      await client.subaccounts.list()
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/subaccount")
    })

    test("fetch calls correct endpoint", async () => {
      await client.subaccounts.fetch("SUB_123")
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/subaccount/SUB_123")
    })

    test("update sends correct payload", async () => {
      await client.subaccounts.update("SUB_123", { business_name: "New Biz Name" })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/subaccount/SUB_123")
      expect(init.method).toBe("PUT")
      expect(JSON.parse(init.body as string)).toEqual({ business_name: "New Biz Name" })
    })
  })

  describe("Subscriptions", () => {
    test("create sends correct payload", async () => {
      const payload = { customer: "CUS_123", plan: "PLN_123" }
      await client.subscriptions.create(payload)
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/subscription")
      expect(init.method).toBe("POST")
      expect(JSON.parse(init.body as string)).toEqual(payload)
    })

    test("list calls correct endpoint", async () => {
      await client.subscriptions.list()
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/subscription")
    })

    test("fetch calls correct endpoint", async () => {
      await client.subscriptions.fetch("SUB_123")
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/subscription/SUB_123")
    })

    test("disable sends correct payload", async () => {
      await client.subscriptions.disable("SUB_123", "token_123")
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/subscription/disable")
      expect(init.method).toBe("POST")
      expect(JSON.parse(init.body as string)).toEqual({ code: "SUB_123", token: "token_123" })
    })
  })

  describe("Virtual Accounts", () => {
    test("assign sends correct payload", async () => {
      const payload = { email: "test@example.com", first_name: "John", last_name: "Doe", phone: "08012345678", preferred_bank: "058" }
      await client.virtualAccounts.assign(payload)
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/dedicated_account")
      expect(init.method).toBe("POST")
      expect(JSON.parse(init.body as string)).toEqual(payload)
    })

    test("list handles query params", async () => {
      await client.virtualAccounts.list({ active: true })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/dedicated_account")
      expect(url).toContain("active=true")
    })

    test("requery calls correct endpoint", async () => {
      await client.virtualAccounts.requery({ account_number: "0000000000", provider_slug: "bank" })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/dedicated_account/requery")
      expect(url).toContain("account_number=0000000000")
    })
  })

  describe("Webhooks", () => {
    test("isWebhookEvent returns true for valid event", () => {
      const event = { event: "charge.success", data: {} }
      expect(isWebhookEvent(event)).toBe(true)
    })

    test("isWebhookEvent returns false for invalid event", () => {
      expect(isWebhookEvent(null)).toBe(false)
      expect(isWebhookEvent({})).toBe(false)
      expect(isWebhookEvent({ event: 123 })).toBe(false)
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

  describe("BulkChargesResource", () => {
    test("create sends correct payload", async () => {
      const payload = {
        batch: [
          {
            authorization: "AUTH_w123456789",
            amount: 2500,
            reference: "ref_123456",
          },
        ],
      }
      await client.bulkCharges.create(payload)
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/bulkcharge")
      expect(init.method).toBe("POST")
      expect(JSON.parse(init.body as string)).toEqual(payload)
    })

    test("listBatches handles query params", async () => {
      await client.bulkCharges.listBatches({
        status: "pending",
        page: 1,
        perPage: 20,
        from: "2023-01-01",
        to: "2023-01-31",
      })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/bulkcharge")
      expect(url).toContain("status=pending")
      expect(url).toContain("page=1")
      expect(url).toContain("perPage=20")
      expect(url).toContain("from=2023-01-01")
      expect(url).toContain("to=2023-01-31")
    })

    test("get calls correct endpoint", async () => {
      await client.bulkCharges.get("BCH_123456789")
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/bulkcharge/BCH_123456789")
    })

    test("listItems handles query params", async () => {
      await client.bulkCharges.listItems("BCH_123456789", {
        status: "pending",
        page: 1,
        perPage: 20,
      })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/bulkcharge/BCH_123456789/charges")
      expect(url).toContain("status=pending")
      expect(url).toContain("page=1")
      expect(url).toContain("perPage=20")
    })

    test("pause calls correct endpoint", async () => {
      await client.bulkCharges.pause("BCH_123456789")
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/bulkcharge/pause/BCH_123456789")
    })

    test("resume calls correct endpoint", async () => {
      await client.bulkCharges.resume("BCH_123456789")
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/bulkcharge/resume/BCH_123456789")
    })
  })

  describe("ChargesResource", () => {
    test("create sends correct payload", async () => {
      const payload = {
        email: "test@example.com",
        amount: 5000,
        bank: { code: "057", account_number: "0000000000" },
      }
      await client.charges.create(payload)
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/charge")
      expect(init.method).toBe("POST")
      expect(JSON.parse(init.body as string)).toEqual(payload)
    })

    test("submitOtp sends correct payload", async () => {
      const payload = { otp: "123456", reference: "ref_123" }
      await client.charges.submitOtp(payload)
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/charge/submit_otp")
      expect(init.method).toBe("POST")
      expect(JSON.parse(init.body as string)).toEqual(payload)
    })

    test("submitPin sends correct payload", async () => {
      const payload = { pin: "1234", reference: "ref_123" }
      await client.charges.submitPin(payload)
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/charge/submit_pin")
      expect(init.method).toBe("POST")
      expect(JSON.parse(init.body as string)).toEqual(payload)
    })

    test("submitPhone sends correct payload", async () => {
      const payload = { phone: "08012345678", reference: "ref_123" }
      await client.charges.submitPhone(payload)
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/charge/submit_phone")
      expect(init.method).toBe("POST")
      expect(JSON.parse(init.body as string)).toEqual(payload)
    })

    test("submitBirthday sends correct payload", async () => {
      const payload = { birthday: "1990-01-01", reference: "ref_123" }
      await client.charges.submitBirthday(payload)
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/charge/submit_birthday")
      expect(init.method).toBe("POST")
      expect(JSON.parse(init.body as string)).toEqual(payload)
    })

    test("submitAddress sends correct payload", async () => {
      const payload = {
        address: "123 Street",
        city: "Lagos",
        state: "Lagos",
        zipcode: "100001",
        reference: "ref_123",
      }
      await client.charges.submitAddress(payload)
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/charge/submit_address")
      expect(init.method).toBe("POST")
      expect(JSON.parse(init.body as string)).toEqual(payload)
    })

    test("checkPending calls correct endpoint", async () => {
      await client.charges.checkPending("ref_123")
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/charge/ref_123")
    })
  })

  describe("CustomersResource", () => {
    test("create sends correct payload", async () => {
      const payload = {
        email: "test@example.com",
        first_name: "John",
        last_name: "Doe",
        phone: "08012345678",
      }
      await client.customers.create(payload)
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/customer")
      expect(init.method).toBe("POST")
      expect(JSON.parse(init.body as string)).toEqual(payload)
    })

    test("create handles idempotency key", async () => {
      const payload = { email: "test@example.com" }
      await client.customers.create(payload, { idempotencyKey: "key_123" })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [_, init] = mockFetch.mock.calls[0]!
      expect(init.headers).toMatchObject({ "x-idempotency-key": "key_123" })
    })

    test("list handles query params", async () => {
      await client.customers.list({ perPage: 50, page: 2 })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/customer")
      expect(url).toContain("perPage=50")
      expect(url).toContain("page=2")
    })

    test("update sends correct payload", async () => {
      const payload = { first_name: "Jane" }
      await client.customers.update("CUS_12345", payload)
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/customer/CUS_12345")
      expect(init.method).toBe("PUT")
      expect(JSON.parse(init.body as string)).toEqual(payload)
    })
  })

  describe("IntegrationResource", () => {
    test("getPaymentSessionTimeout calls correct endpoint", async () => {
      await client.integration.getPaymentSessionTimeout()
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/integration/payment_session_timeout")
    })

    test("updatePaymentSessionTimeout handles number payload", async () => {
      await client.integration.updatePaymentSessionTimeout(30)
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/integration/payment_session_timeout")
      expect(init.method).toBe("PUT")
      expect(JSON.parse(init.body as string)).toEqual({ timeout: 30 })
    })

    test("updatePaymentSessionTimeout handles object payload", async () => {
      await client.integration.updatePaymentSessionTimeout({ timeout: 60 })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/integration/payment_session_timeout")
      expect(init.method).toBe("PUT")
      expect(JSON.parse(init.body as string)).toEqual({ timeout: 60 })
    })
  })

  describe("Disputes", () => {
    test("list handles query params", async () => {
      await client.disputes.list({ status: "waiting_evidence" })

      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/dispute")
      expect(url).toContain("status=waiting_evidence")
      expect(init.method).toBe("GET")
    })

    test("get calls correct endpoint", async () => {
      await client.disputes.get(123)
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/dispute/123")
    })

    test("listForTransaction calls correct endpoint", async () => {
      await client.disputes.listForTransaction(456)
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/dispute/transaction/456")
    })

    test("submitEvidence sends correct payload", async () => {
      await client.disputes.submitEvidence(123, {
        customer_email: "test@example.com",
        uploaded_filename: "file.jpg",
      })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/dispute/123/evidence")
      expect(init.method).toBe("POST")
      expect(JSON.parse(init.body as string)).toEqual({
        customer_email: "test@example.com",
        uploaded_filename: "file.jpg",
      })
    })

    test("getUploadUrl calls correct endpoint", async () => {
      await client.disputes.getUploadUrl(123)
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/dispute/123/upload_url")
    })
  })

  describe("Misc", () => {
    test("listBanks handles query params", async () => {
      await client.misc.listBanks({ country: "nigeria" })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/bank")
      expect(url).toContain("country=nigeria")
    })

    test("listCountries calls correct endpoint", async () => {
      await client.misc.listCountries()
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/country")
    })

    test("listStates calls correct endpoint", async () => {
      await client.misc.listStates()
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/address/pyramid/states")
    })

    test("resolveCardBin calls correct endpoint", async () => {
      await client.misc.resolveCardBin("412345")
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/decision/bin/412345")
    })

    test("resolveAccount sends correct query params", async () => {
      await client.misc.resolveAccount({ account_number: "0001234567", bank_code: "058" })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/bank/resolve")
      expect(url).toContain("account_number=0001234567")
      expect(url).toContain("bank_code=058")
    })
  })

  describe("Payment Pages", () => {
    test("create sends correct payload", async () => {
      await client.paymentPages.create({ name: "New Page" })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/page")
      expect(init.method).toBe("POST")
      expect(JSON.parse(init.body as string)).toEqual({ name: "New Page" })
    })

    test("list handles query params", async () => {
      await client.paymentPages.list({ perPage: 10 })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/page")
      expect(url).toContain("perPage=10")
    })

    test("get calls correct endpoint", async () => {
      await client.paymentPages.get("slug-123")
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/page/slug-123")
    })

    test("update sends correct payload", async () => {
      await client.paymentPages.update("slug-123", { name: "Updated Name" })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/page/slug-123")
      expect(init.method).toBe("PUT")
      expect(JSON.parse(init.body as string)).toEqual({ name: "Updated Name" })
    })

    test("checkSlug sends correct payload", async () => {
      await client.paymentPages.checkSlug({ slug: "new-slug" })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/page/check_slug")
      expect(init.method).toBe("POST")
      expect(JSON.parse(init.body as string)).toEqual({ slug: "new-slug" })
    })
  })

  describe("Payment Requests", () => {
    test("create sends correct payload", async () => {
      await client.paymentRequests.create({ customer: "CUS_123", amount: 1000 })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/paymentrequest")
      expect(init.method).toBe("POST")
      expect(JSON.parse(init.body as string)).toEqual({ customer: "CUS_123", amount: 1000 })
    })

    test("list handles query params", async () => {
      await client.paymentRequests.list({ status: "pending" })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/paymentrequest")
      expect(url).toContain("status=pending")
    })

    test("get calls correct endpoint", async () => {
      await client.paymentRequests.get(123)
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/paymentrequest/123")
    })

    test("update sends correct payload", async () => {
      await client.paymentRequests.update(123, { amount: 2000 })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/paymentrequest/123")
      expect(init.method).toBe("PUT")
      expect(JSON.parse(init.body as string)).toEqual({ amount: 2000 })
    })

    test("sendNotification calls correct endpoint", async () => {
      await client.paymentRequests.sendNotification(123)
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/paymentrequest/notify/123")
      expect(init.method).toBe("POST")
    })

    test("totals calls correct endpoint", async () => {
      await client.paymentRequests.totals()
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/paymentrequest/totals")
    })

    test("verify calls correct endpoint", async () => {
      await client.paymentRequests.verify("REQ_123")
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/paymentrequest/verify/REQ_123")
    })

    test("archive calls correct endpoint", async () => {
      await client.paymentRequests.archive(123)
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/paymentrequest/archive/123")
      expect(init.method).toBe("POST")
    })
  })

  describe("Terminal", () => {
    test("list calls correct endpoint", async () => {
      await client.terminal.list()
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/terminal")
    })

    test("fetch calls correct endpoint", async () => {
      await client.terminal.fetch("term_123")
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/terminal/term_123")
    })

    test("sendEvent sends correct payload", async () => {
      await client.terminal.sendEvent("term_123", { type: "invoice", action: "process", data: { id: "inv_123", reference: "ref_123" } })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/terminal/term_123/event")
      expect(init.method).toBe("POST")
      expect(JSON.parse(init.body as string)).toEqual({ type: "invoice", action: "process", data: { id: "inv_123", reference: "ref_123" } })
    })
  })

  describe("Transfer Control", () => {
    test("resendOtp sends correct payload", async () => {
      await client.transferControl.resendOtp({ transfer_code: "TRF_123", reason: "resend" })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/transfer/resend_otp")
      expect(init.method).toBe("POST")
      expect(JSON.parse(init.body as string)).toEqual({ transfer_code: "TRF_123", reason: "resend" })
    })

    test("disableOtp sends correct payload", async () => {
      await client.transferControl.disableOtp({})
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/transfer/disable_otp")
      expect(init.method).toBe("POST")
    })

    test("finalizeDisableOtp sends correct payload", async () => {
      await client.transferControl.finalizeDisableOtp({ otp: "123456" })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/transfer/disable_otp_finalize")
      expect(init.method).toBe("POST")
      expect(JSON.parse(init.body as string)).toEqual({ otp: "123456" })
    })

    test("enableOtp sends correct payload", async () => {
      await client.transferControl.enableOtp({ otp: "123456" })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/transfer/enable_otp")
      expect(init.method).toBe("POST")
      expect(JSON.parse(init.body as string)).toEqual({ otp: "123456" })
    })

    test("getBalance calls correct endpoint", async () => {
      await client.transferControl.getBalance()
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/balance")
    })
  })

  describe("Transfer Recipients", () => {
    test("create sends correct payload", async () => {
      const payload: any = {
        type: "nuban",
        name: "John Doe",
        account_number: "0001234567",
        bank_code: "058"
      }
      await client.transferRecipients.create(payload)
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/transferrecipient")
      expect(init.method).toBe("POST")
      expect(JSON.parse(init.body as string)).toEqual(payload)
    })

    test("list calls correct endpoint", async () => {
      await client.transferRecipients.list()
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/transferrecipient")
    })

    test("fetch calls correct endpoint", async () => {
      await client.transferRecipients.fetch("RCP_123")
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/transferrecipient/RCP_123")
    })

    test("update sends correct payload", async () => {
      await client.transferRecipients.update("RCP_123", { name: "New Name" })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/transferrecipient/RCP_123")
      expect(init.method).toBe("PUT")
      expect(JSON.parse(init.body as string)).toEqual({ name: "New Name" })
    })
  })



  describe("Products", () => {
    test("create sends correct payload", async () => {
      await client.products.create({ name: "Product A", price: 5000, currency: "NGN" })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/product")
      expect(init.method).toBe("POST")
      expect(JSON.parse(init.body as string)).toEqual({ name: "Product A", price: 5000, currency: "NGN" })
    })

    test("list handles query params", async () => {
      await client.products.list({ perPage: 10 })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/product")
      expect(url).toContain("perPage=10")
    })

    test("get calls correct endpoint", async () => {
      await client.products.get(123)
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/product/123")
    })

    test("update sends correct payload", async () => {
      await client.products.update(123, { name: "Product B" })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/product/123")
      expect(init.method).toBe("PUT")
      expect(JSON.parse(init.body as string)).toEqual({ name: "Product B" })
    })
  })

  describe("Refunds", () => {
    test("create sends correct payload", async () => {
      await client.refunds.create({ transaction: "ref_123" })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/refund")
      expect(init.method).toBe("POST")
      expect(JSON.parse(init.body as string)).toEqual({ transaction: "ref_123" })
    })

    test("list handles query params", async () => {
      await client.refunds.list({ transaction: "ref_123" })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/refund")
      expect(url).toContain("transaction=ref_123")
    })

    test("get calls correct endpoint", async () => {
      await client.refunds.get("ref_123")
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/refund/ref_123")
    })

    test("retry sends correct payload", async () => {
      await client.refunds.retry("ref_123", {
        refund_account_details: {
          currency: "NGN",
          account_number: "0001234567",
          bank_id: "058"
        }
      })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url, init] = mockFetch.mock.calls[0]!
      expect(url).toContain("/refund/retry_with_customer_details/ref_123")
      expect(init.method).toBe("POST")
      expect(JSON.parse(init.body as string)).toEqual({
        refund_account_details: {
          currency: "NGN",
          account_number: "0001234567",
          bank_id: "058"
        }
      })
    })
  })

  describe("Settlements", () => {
    test("list handles query params", async () => {
      await client.settlements.list({ status: "success" })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/settlement")
      expect(url).toContain("status=success")
    })

    test("listTransactions handles query params", async () => {
      await client.settlements.listTransactions(123, { perPage: 10 })
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [url] = mockFetch.mock.calls[0]!
      expect(url).toContain("/settlement/123/transactions")
      expect(url).toContain("perPage=10")
    })
  })
})
