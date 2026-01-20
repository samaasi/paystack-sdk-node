import type {
  InitializeTransactionRequest,
  VerifyTransactionApiResponse,
  RequeryTransactionApiResponse,
  InitializeTransactionApiResponse,
} from './transactions.types'
import { BaseResource } from '../base'
import { withIdempotencyKey } from '../../utils/idempotency'

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
   * Re-query a transaction by its ID.
   *
   * @param id - The numeric ID of the transaction to fetch
   * @returns A promise resolving to the transaction details
   * @see https://paystack.com/docs/api/transaction/#fetch
   */
  requery(id: number): Promise<RequeryTransactionApiResponse> {
    return this.executor.execute<RequeryTransactionApiResponse>(
      `${this.basePath}/${id}`,
      {
        method: 'GET',
      },
    )
  }
}
