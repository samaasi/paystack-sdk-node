import { BaseResource } from '../base'
import { stringifyQuery } from '../../utils/qs'
import { AutoPaginator, type PaginatorOptions } from '../../utils/pagination'
import type {
  FetchTransferResponse,
  FinalizeTransferRequest,
  FinalizeTransferResponse,
  InitiateTransferRequest,
  InitiateTransferResponse,
  ListTransfersQuery,
  ListTransfersResponse,
  Transfer,
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

    return this.executor.execute<InitiateTransferResponse>(this.basePath, init)
  }

  /**
   * List transfers available on your integration.
   *
   * @param query - Optional query parameters for filtering
   * @returns A promise resolving to the list of transfers
   * @see https://paystack.com/docs/api/transfer/#list
   */
  list(query: ListTransfersQuery = {}): Promise<ListTransfersResponse> {
    const qs = stringifyQuery(query)
    const path = qs ? `${this.basePath}?${qs}` : this.basePath

    return this.executor.get<ListTransfersResponse>(path)
  }

  /**
   * List transfers via an async iterator.
   *
   * @param query - Optional query parameters for filtering
   * @returns An async paginator that yields transfers page by page
   */
  listAll(
    query: ListTransfersQuery = {},
  ): AutoPaginator<Transfer, ListTransfersQuery> {
    return new AutoPaginator({
      fetchPage: (q) => this.list(q),
      initialQuery: query,
    })
  }

  /**
   * Fetch a transfer by ID or transfer code.
   *
   * @param idOrCode - The transfer ID or transfer code
   * @returns A promise resolving to the transfer details
   * @see https://paystack.com/docs/api/transfer/#fetch
   */
  fetch(idOrCode: string | number): Promise<FetchTransferResponse> {
    return this.executor.get<FetchTransferResponse>(
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
