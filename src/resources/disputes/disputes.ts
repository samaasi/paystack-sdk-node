import { BaseResource } from "../base"
import type {
  DisputeStatus,
  GetDisputeApiResponse,
  GetUploadUrlApiResponse,
  ListDisputesApiResponse,
  ListDisputesQuery,
  ListTransactionDisputesApiResponse,
  SubmitEvidenceApiResponse,
  SubmitEvidenceRequest,
} from "./disputes.types"

export class DisputesResource extends BaseResource {
  private readonly basePath = "/dispute"

  list(query: ListDisputesQuery = {}): Promise<ListDisputesApiResponse> {
    const search = new URLSearchParams()

    if (query.perPage !== undefined) {
      search.set("perPage", String(query.perPage))
    }

    if (query.page !== undefined) {
      search.set("page", String(query.page))
    }

    if (query.status !== undefined) {
      search.set("status", query.status as DisputeStatus)
    }

    if (query.from !== undefined) {
      search.set("from", query.from)
    }

    if (query.to !== undefined) {
      search.set("to", query.to)
    }

    if (query.transaction !== undefined) {
      search.set("transaction", String(query.transaction))
    }

    if (query.amount !== undefined) {
      search.set("amount", String(query.amount))
    }

    const path =
      search.size > 0
        ? `${this.basePath}?${search.toString()}`
        : this.basePath

    return this.executor.execute<ListDisputesApiResponse>(path, {
      method: "GET",
    })
  }

  get(id: number): Promise<GetDisputeApiResponse> {
    return this.executor.execute<GetDisputeApiResponse>(
      `${this.basePath}/${id}`,
      {
        method: "GET",
      },
    )
  }

  listForTransaction(
    transactionId: number,
  ): Promise<ListTransactionDisputesApiResponse> {
    const path = `${this.basePath}/transaction/${transactionId}`

    return this.executor.execute<ListTransactionDisputesApiResponse>(path, {
      method: "GET",
    })
  }

  submitEvidence(
    id: number,
    payload: SubmitEvidenceRequest,
  ): Promise<SubmitEvidenceApiResponse> {
    const path = `${this.basePath}/${id}/evidence`

    return this.executor.execute<SubmitEvidenceApiResponse>(path, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  getUploadUrl(id: number): Promise<GetUploadUrlApiResponse> {
    const path = `${this.basePath}/${id}/upload_url`

    return this.executor.execute<GetUploadUrlApiResponse>(path, {
      method: "GET",
    })
  }
}
