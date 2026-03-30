import type {
  CreateTransferRecipientRequest,
  CreateTransferRecipientResponse,
  FetchTransferRecipientResponse,
  ListTransferRecipientsResponse,
  UpdateTransferRecipientRequest,
  UpdateTransferRecipientResponse,
} from './recipients.types'
import { BaseResource } from '../base'
import { withIdempotencyKey } from '../../utils/idempotency'

export interface CreateTransferRecipientOptions {
  idempotencyKey?: string
}

/**
 * Transfer Recipients resource
 * @see https://paystack.com/docs/api/transfer-recipient/
 */
export class TransferRecipientsResource extends BaseResource {
  private readonly basePath = '/transferrecipient'

  /**
   * Create a transfer recipient
   * @param payload - The recipient details
   * @param options - Additional options (idempotency key)
   * @returns A promise resolving to the created recipient
   * @see https://paystack.com/docs/api/transfer-recipient/#create
   */
  create(
    payload: CreateTransferRecipientRequest,
    options: CreateTransferRecipientOptions = {},
  ): Promise<CreateTransferRecipientResponse> {
    const init = withIdempotencyKey({}, options.idempotencyKey)

    return this.executor.post<CreateTransferRecipientResponse>(
      this.basePath,
      payload,
      init,
    )
  }

  /**
   * List transfer recipients
   * @returns A promise resolving to the list of recipients
   * @see https://paystack.com/docs/api/transfer-recipient/#list
   */
  list(): Promise<ListTransferRecipientsResponse> {
    return this.executor.get<ListTransferRecipientsResponse>(this.basePath)
  }

  /**
   * Fetch a transfer recipient
   * @param recipientIdOrCode - The recipient ID or code
   * @returns A promise resolving to the recipient details
   * @see https://paystack.com/docs/api/transfer-recipient/#fetch
   */
  fetch(
    recipientIdOrCode: string | number,
  ): Promise<FetchTransferRecipientResponse> {
    const id = String(recipientIdOrCode)

    return this.executor.get<FetchTransferRecipientResponse>(
      `${this.basePath}/${encodeURIComponent(id)}`,
    )
  }

  /**
   * Update a transfer recipient
   * @param recipientCode - The recipient code
   * @param payload - The update details
   * @returns A promise resolving to the updated recipient
   * @see https://paystack.com/docs/api/transfer-recipient/#update
   */
  update(
    recipientCode: string,
    payload: UpdateTransferRecipientRequest,
  ): Promise<UpdateTransferRecipientResponse> {
    return this.executor.put<UpdateTransferRecipientResponse>(
      `${this.basePath}/${encodeURIComponent(recipientCode)}`,
      payload,
    )
  }
}
