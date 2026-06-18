import type {
  Dispute,
  ListDisputesQuery,
  SubmitEvidenceRequest,
  GetDisputeApiResponse,
  GetUploadUrlApiResponse,
  ListDisputesApiResponse,
  SubmitEvidenceApiResponse,
  ListTransactionDisputesApiResponse,
} from './disputes.types'
import { BaseResource } from '../base'
import { stringifyQuery } from '../../utils/qs'
import { AutoPaginator } from '../../utils/pagination'

export class DisputesResource extends BaseResource {
  private readonly basePath = '/dispute'

  /**
   * List disputes.
   *
   * @param query - The query parameters for filtering
   * @returns A promise resolving to the list of disputes
   * @see https://paystack.com/docs/api/dispute/#list
   */
  list(query: ListDisputesQuery = {}): Promise<ListDisputesApiResponse> {
    const qs = stringifyQuery(query)
    const path = qs ? `${this.basePath}?${qs}` : this.basePath

    return this.executor.execute<ListDisputesApiResponse>(path, {
      method: 'GET',
    })
  }

  listAll(query: ListDisputesQuery = {}): AutoPaginator<Dispute, ListDisputesQuery> {
    return new AutoPaginator({ fetchPage: (q) => this.list(q), initialQuery: query })
  }

  /**
   * Fetch a dispute.
   *
   * @param id - The dispute ID
   * @returns A promise resolving to the dispute details
   * @see https://paystack.com/docs/api/dispute/#fetch
   */
  get(id: number): Promise<GetDisputeApiResponse> {
    return this.executor.execute<GetDisputeApiResponse>(
      `${this.basePath}/${id}`,
      {
        method: 'GET',
      },
    )
  }

  /**
   * List disputes for a transaction.
   *
   * @param transactionId - The transaction ID
   * @returns A promise resolving to the list of disputes for the transaction
   * @see https://paystack.com/docs/api/dispute/#list-transaction-disputes
   */
  listForTransaction(
    transactionId: number,
  ): Promise<ListTransactionDisputesApiResponse> {
    const path = `${this.basePath}/transaction/${transactionId}`

    return this.executor.execute<ListTransactionDisputesApiResponse>(path, {
      method: 'GET',
    })
  }

  /**
   * Submit evidence for a dispute.
   *
   * @param id - The dispute ID
   * @param payload - The evidence payload
   * @returns A promise resolving to the result
   * @see https://paystack.com/docs/api/dispute/#submit-evidence
   */
  submitEvidence(
    id: number,
    payload: SubmitEvidenceRequest,
  ): Promise<SubmitEvidenceApiResponse> {
    const path = `${this.basePath}/${id}/evidence`

    return this.executor.execute<SubmitEvidenceApiResponse>(path, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  /**
   * Get upload URL for dispute evidence.
   *
   * @param id - The dispute ID
   * @returns A promise resolving to the upload URL
   * @see https://paystack.com/docs/api/dispute/#upload-url
   */
  getUploadUrl(id: number): Promise<GetUploadUrlApiResponse> {
    const path = `${this.basePath}/${id}/upload_url`

    return this.executor.execute<GetUploadUrlApiResponse>(path, {
      method: 'GET',
    })
  }
}
