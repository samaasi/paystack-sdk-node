import type {
  InitializeTransactionRequest,
  VerifyTransactionApiResponse,
  RequeryTransactionApiResponse,
  InitializeTransactionApiResponse,
} from "./transactions.types"
import { BaseResource } from "../base"
import { withIdempotencyKey } from "../../utils/idempotency"

export interface InitializeOptions {
  idempotencyKey?: string
}

export class TransactionsResource extends BaseResource {
  private readonly basePath = "/transaction"

  /**
   * Initialize a transaction.
   *
   * @see https://paystack.com/docs/api/transaction/#initialize
   */
  initialize(
    payload: InitializeTransactionRequest,
    options: InitializeOptions = {},
  ): Promise<InitializeTransactionApiResponse> {
    const init = withIdempotencyKey(
      {
        method: "POST",
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
   * @see https://paystack.com/docs/api/transaction/#verify
   */
  verify(reference: string): Promise<VerifyTransactionApiResponse> {
    return this.executor.execute<VerifyTransactionApiResponse>(
      `${this.basePath}/verify/${encodeURIComponent(reference)}`,
      {
        method: "GET",
      },
    )
  }

  /**
   * Re-query a transaction by its ID.
   *
   * @see https://paystack.com/docs/api/transaction/#fetch
   */
  requery(id: number): Promise<RequeryTransactionApiResponse> {
    return this.executor.execute<RequeryTransactionApiResponse>(
      `${this.basePath}/${id}`,
      {
        method: "GET",
      },
    )
  }
}
