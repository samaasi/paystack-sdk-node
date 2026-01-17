import type {
  CreateTransferRecipientRequest,
  CreateTransferRecipientResponse,
  FetchTransferRecipientResponse,
  ListTransferRecipientsResponse,
  UpdateTransferRecipientRequest,
  UpdateTransferRecipientResponse,
} from "./recipients.types"
  import { BaseResource } from "../base"
  import { withIdempotencyKey } from "../../utils/idempotency"

export interface CreateTransferRecipientOptions {
  idempotencyKey?: string
}

export class TransferRecipientsResource extends BaseResource {
  private readonly basePath = "/transferrecipient"

  create(
    payload: CreateTransferRecipientRequest,
    options: CreateTransferRecipientOptions = {},
  ): Promise<CreateTransferRecipientResponse> {
    const init = withIdempotencyKey(
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      options.idempotencyKey,
    )

    return this.executor.execute<CreateTransferRecipientResponse>(
      this.basePath,
      init,
    )
  }

  list(): Promise<ListTransferRecipientsResponse> {
    return this.executor.execute<ListTransferRecipientsResponse>(
      this.basePath,
      {
        method: "GET",
      },
    )
  }

  fetch(
    recipientIdOrCode: string | number,
  ): Promise<FetchTransferRecipientResponse> {
    const id = String(recipientIdOrCode)

    return this.executor.execute<FetchTransferRecipientResponse>(
      `${this.basePath}/${encodeURIComponent(id)}`,
      {
        method: "GET",
      },
    )
  }

  update(
    recipientCode: string,
    payload: UpdateTransferRecipientRequest,
  ): Promise<UpdateTransferRecipientResponse> {
    return this.executor.execute<UpdateTransferRecipientResponse>(
      `${this.basePath}/${encodeURIComponent(recipientCode)}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
    )
  }
}
