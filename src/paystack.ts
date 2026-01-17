import { loadPaystackConfig } from "./core/config"
import { RequestExecutor } from "./core/request-executor"
import { StatusResource } from "./resources/status/status"
import { DisputesResource } from "./resources/disputes/disputes"
import { TerminalResource } from "./resources/terminal/terminal"
import { CustomersResource } from "./resources/customers/customers"
import { TransfersResource } from "./resources/transfers/transfers"
import type { PaystackConfig, LoadConfigOptions } from "./core/config"
import { SubaccountsResource } from "./resources/subaccounts/subaccounts"
import { IntegrationResource } from "./resources/integration/integration"
import { TransactionsResource } from "./resources/transactions/transactions"
import { VerificationResource } from "./resources/verification/verification"
import { SubscriptionsResource } from "./resources/subscriptions/subscriptions"
import { VirtualAccountsResource } from "./resources/virtual-accounts/virtual-accounts"
import { TransferRecipientsResource } from "./resources/transfer-recipients/recipients"
import { TransferControlResource } from "./resources/transfer-control/transfer-control"
import { MiscResource } from "./resources/misc/misc"
import { ChargesResource } from "./resources/charges/charges"
import { BulkChargesResource } from "./resources/bulk-charges/bulk-charges"
import { PaymentPagesResource } from "./resources/payment-pages/payment-pages"
import { PaymentRequestsResource } from "./resources/payment-requests/payment-requests"

export interface PaystackClientConfig {
  apiKey: string
  baseUrl?: string
  maxRetries?: number
  fetchImpl?: (input: string, init?: RequestInit) => Promise<any>
}

export interface PaystackEnvOptions extends LoadConfigOptions {
  fetchImpl?: (input: string, init?: RequestInit) => Promise<any>
}

export class PaystackClient {
  readonly config: PaystackConfig
  readonly transactions: TransactionsResource
  readonly customers: CustomersResource
  readonly virtualAccounts: VirtualAccountsResource
  readonly transfers: TransfersResource
  readonly verification: VerificationResource
  readonly transferRecipients: TransferRecipientsResource
  readonly transferControl: TransferControlResource
  readonly terminal: TerminalResource
  readonly subaccounts: SubaccountsResource
  readonly subscriptions: SubscriptionsResource
  readonly integration: IntegrationResource
  readonly status: StatusResource
  readonly misc: MiscResource
  readonly disputes: DisputesResource
  readonly charges: ChargesResource
  readonly bulkCharges: BulkChargesResource
  readonly paymentPages: PaymentPagesResource
  readonly paymentRequests: PaymentRequestsResource

  constructor(config: PaystackClientConfig) {
    const normalized: PaystackConfig = {
      apiKey: config.apiKey,
      baseUrl: config.baseUrl ?? "https://api.paystack.co",
      maxRetries: config.maxRetries ?? 3,
    }

    this.config = normalized

    const executor = new RequestExecutor({
      apiKey: normalized.apiKey,
      baseUrl: normalized.baseUrl,
      retry: {
        maxRetries: normalized.maxRetries,
      },
      fetchImpl: config.fetchImpl,
    })

    const resourceOptions = { executor }

    this.transactions = new TransactionsResource(resourceOptions)
    this.customers = new CustomersResource(resourceOptions)
    this.virtualAccounts = new VirtualAccountsResource(resourceOptions)
    this.transfers = new TransfersResource(resourceOptions)
    this.verification = new VerificationResource(resourceOptions)
    this.transferRecipients = new TransferRecipientsResource(resourceOptions)
    this.transferControl = new TransferControlResource(resourceOptions)
    this.terminal = new TerminalResource(resourceOptions)
    this.subaccounts = new SubaccountsResource(resourceOptions)
    this.subscriptions = new SubscriptionsResource(resourceOptions)
    this.integration = new IntegrationResource(resourceOptions)
    this.status = new StatusResource({
      fetchImpl: config.fetchImpl,
    })
    this.misc = new MiscResource(resourceOptions)
    this.disputes = new DisputesResource(resourceOptions)
    this.charges = new ChargesResource(resourceOptions)
    this.bulkCharges = new BulkChargesResource(resourceOptions)
    this.paymentPages = new PaymentPagesResource(resourceOptions)
    this.paymentRequests = new PaymentRequestsResource(resourceOptions)
  }
}

export async function createPaystackClient(
  options: PaystackEnvOptions = {},
): Promise<PaystackClient> {
  const config = await loadPaystackConfig(options)

  return new PaystackClient({
    apiKey: config.apiKey,
    baseUrl: config.baseUrl,
    maxRetries: config.maxRetries,
    fetchImpl: options.fetchImpl,
  })
}
