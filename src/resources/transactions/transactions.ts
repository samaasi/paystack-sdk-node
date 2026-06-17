import type {
  InitializeTransactionRequest,
  VerifyTransactionApiResponse,
  FetchTransactionApiResponse,
  InitializeTransactionApiResponse,
  ListTransactionsQuery,
  ListTransactionsApiResponse,
  ChargeAuthorizationRequest,
  ChargeAuthorizationApiResponse,
  TransactionTimelineApiResponse,
  TransactionTotalsQuery,
  TransactionTotalsApiResponse,
  ExportTransactionsQuery,
  ExportTransactionsApiResponse,
  PartialDebitRequest,
  PartialDebitApiResponse,
} from './transactions.types'
import { BaseResource } from '../base'
import { withIdempotencyKey } from '../../utils/idempotency'
import { stringifyQuery } from '../../utils/qs'
import { AutoPaginator, type PaginatorOptions } from '../../utils/pagination'
import type { Transaction } from './transactions.types'

export interface InitializeOptions {
  idempotencyKey?: string
}

export class TransactionsResource extends BaseResource {
  private readonly basePath = '/transaction'

  /**
   * Initialize a transaction.
   *
   * @param payload - The transaction initialization details (email, amount, etc.)
   * @param options - Optional configuration including idempotency key
   * @returns A promise resolving to the initialization response containing the authorization URL and access code
   * @see https://paystack.com/docs/api/transaction/#initialize
   */
  initialize(
    payload: InitializeTransactionRequest,
    options: InitializeOptions = {},
  ): Promise<InitializeTransactionApiResponse> {
    const init = withIdempotencyKey(
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      options.idempotencyKey,
    )

    return this.executor.execute<InitializeTransactionApiResponse>(
      `${this.basePath}/initialize`,
      init,
    )
  }

  /**
   * Verify the status of a transaction using its reference.
   *
   * @param reference - The transaction reference
   * @returns A promise resolving to the transaction verification details
   * @see https://paystack.com/docs/api/transaction/#verify
   */
  verify(reference: string): Promise<VerifyTransactionApiResponse> {
    return this.executor.execute<VerifyTransactionApiResponse>(
      `${this.basePath}/verify/${encodeURIComponent(reference)}`,
      {
        method: 'GET',
      },
    )
  }

  /**
   * Fetch a transaction by its ID.
   *
   * @param id - The numeric ID of the transaction to fetch
   * @returns A promise resolving to the transaction details
   * @see https://paystack.com/docs/api/transaction/#fetch
   */
  fetch(id: number): Promise<FetchTransactionApiResponse> {
    return this.executor.get<FetchTransactionApiResponse>(
      `${this.basePath}/${id}`,
    )
  }

  /**
   * Requery a transaction (alias for fetch, for backward compatibility).
   *
   * @param id - The numeric ID of the transaction to requery
   * @returns A promise resolving to the transaction details
   * @see https://paystack.com/docs/api/transaction/#fetch
   * @deprecated Use fetch instead
   */
  requery(id: number): Promise<FetchTransactionApiResponse> {
    return this.fetch(id)
  }

  /**
   * List transactions available on your integration.
   *
   * @param query - The query parameters for filtering (perPage, page, status, etc.)
   * @returns A promise resolving to the list of transactions
   * @see https://paystack.com/docs/api/transaction/#list
   */
  list(
    query: ListTransactionsQuery = {},
  ): Promise<ListTransactionsApiResponse> {
    const qs = stringifyQuery(query as Record<string, unknown>)
    const path = qs ? `${this.basePath}?${qs}` : this.basePath

    return this.executor.get<ListTransactionsApiResponse>(path)
  }

  /**
   * List transactions available on your integration via an async iterator.
   *
   * @param query - The query parameters for filtering (perPage, page, status, etc.)
   * @returns An async iterator over transactions
   */
  listAll(
    query: ListTransactionsQuery = {},
  ): AutoPaginator<Transaction, ListTransactionsQuery> {
    const options: PaginatorOptions<Transaction, ListTransactionsQuery> = {
      fetchPage: (q) => this.list(q),
      initialQuery: query,
    }

    return new AutoPaginator(options)
  }

  /**
   * All authorizations marked as reusable can be charged with this endpoint whenever you need to receive payments.
   *
   * @param payload - The charge authorization request details
   * @param options - Optional configuration including idempotency key
   * @returns A promise resolving to the charged transaction
   * @see https://paystack.com/docs/api/transaction/#charge-authorization
   */
  chargeAuthorization(
    payload: ChargeAuthorizationRequest,
    options: InitializeOptions = {},
  ): Promise<ChargeAuthorizationApiResponse> {
    const init = withIdempotencyKey({}, options.idempotencyKey)

    return this.executor.post<ChargeAuthorizationApiResponse>(
      `${this.basePath}/charge_authorization`,
      payload,
      init,
    )
  }

  /**
   * View the timeline of a transaction.
   *
   * @param idOrReference - The ID or reference of the transaction
   * @returns A promise resolving to the transaction timeline
   * @see https://paystack.com/docs/api/transaction/#timeline
   */
  timeline(
    idOrReference: string | number,
  ): Promise<TransactionTimelineApiResponse> {
    return this.executor.get<TransactionTimelineApiResponse>(
      `${this.basePath}/timeline/${encodeURIComponent(String(idOrReference))}`,
    )
  }

  /**
   * Total amount received on your account.
   *
   * @param query - The query parameters
   * @returns A promise resolving to the transaction totals
   * @see https://paystack.com/docs/api/transaction/#totals
   */
  totals(
    query: TransactionTotalsQuery = {},
  ): Promise<TransactionTotalsApiResponse> {
    const qs = stringifyQuery(query as Record<string, unknown>)
    const path = qs
      ? `${this.basePath}/totals?${qs}`
      : `${this.basePath}/totals`

    return this.executor.get<TransactionTotalsApiResponse>(path)
  }

  /**
   * Export transactions carried out on your integration.
   *
   * @param query - The query parameters
   * @returns A promise resolving to the export response containing the path to download the export
   * @see https://paystack.com/docs/api/transaction/#export
   */
  export(
    query: ExportTransactionsQuery = {},
  ): Promise<ExportTransactionsApiResponse> {
    const qs = stringifyQuery(query as Record<string, unknown>)
    const path = qs
      ? `${this.basePath}/export?${qs}`
      : `${this.basePath}/export`

    return this.executor.get<ExportTransactionsApiResponse>(path)
  }

  /**
   * Retrieve part of a payment from a customer.
   *
   * @param payload - The partial debit request details
   * @param options - Optional configuration including idempotency key
   * @returns A promise resolving to the partial debit response
   * @see https://paystack.com/docs/api/transaction/#partial-debit
   */
  partialDebit(
    payload: PartialDebitRequest,
    options: InitializeOptions = {},
  ): Promise<PartialDebitApiResponse> {
    const init = withIdempotencyKey({}, options.idempotencyKey)

    return this.executor.post<PartialDebitApiResponse>(
      `${this.basePath}/partial_debit`,
      payload,
      init,
    )
  }
}
