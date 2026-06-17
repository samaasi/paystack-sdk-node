import { BaseResource } from '../base'
import { stringifyQuery } from '../../utils/qs'
import { AutoPaginator, type PaginatorOptions } from '../../utils/pagination'
import type { Transfer } from './transfers.types'
import type {
  FinalizeTransferRequest,
  FinalizeTransferResponse,
  InitiateTransferRequest,
  InitiateTransferResponse,
} from './transfers.types'
import { withIdempotencyKey } from '../../utils/idempotency'

export interface InitiateTransferOptions {
  idempotencyKey?: string
}

export class TransfersResource extends BaseResource {
  private readonly basePath = '/transfer'

  /**
   * Initiate a single transfer.
   *
   * @param payload - The transfer details
   * @param options - Optional parameters (e.g., idempotency key)
   * @returns A promise resolving to the transfer response
   * @see https://paystack.com/docs/api/transfer/#initiate
   */
  initiate(
    payload: InitiateTransferRequest,
    options: InitiateTransferOptions = {},
  ): Promise<InitiateTransferResponse> {
    const init = withIdempotencyKey(
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      options.idempotencyKey,
    )

    return this.executor.post<InitiateTransferResponse>(
      this.basePath,
      payload,
      init,
    )
  }

  /**
   * List transfers available on your integration.
   */
  list(query: Record<string, unknown> = {}): Promise<any> {
    const qs = stringifyQuery(query)
    const path = qs ? `${this.basePath}?${qs}` : this.basePath

    return this.executor.get<any>(path)
  }

  /**
   * List transfers via an async iterator.
   */
  listAll(
    query: Record<string, unknown> = {},
  ): AutoPaginator<Transfer, Record<string, unknown>> {
    return new AutoPaginator({
      fetchPage: (q) => this.list(q),
      initialQuery: query,
    })
  }

  /**
   * Fetch a transfer.
   */
  fetch(idOrCode: string | number): Promise<any> {
    return this.executor.get<any>(
      `${this.basePath}/${encodeURIComponent(String(idOrCode))}`,
    )
  }

  /**
   * Finalize a transfer that requires OTP.
   *
   * @param payload - The finalization details (OTP, transfer code)
   * @returns A promise resolving to the finalization response
   * @see https://paystack.com/docs/api/transfer/#finalize
   */
  finalize(
    payload: FinalizeTransferRequest,
  ): Promise<FinalizeTransferResponse> {
    return this.executor.post<FinalizeTransferResponse>(
      `${this.basePath}/finalize_transfer`,
      payload,
    )
  }
}
