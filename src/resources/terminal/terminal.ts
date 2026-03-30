import { BaseResource } from '../base'
import type {
  FetchTerminalResponse,
  ListTerminalsResponse,
  SendEventRequest,
  SendEventResponse,
} from './terminal.types'

export class TerminalResource extends BaseResource {
  private readonly basePath = '/terminal'

  list(): Promise<ListTerminalsResponse> {
    return this.executor.get<ListTerminalsResponse>(this.basePath)
  }

  fetch(idOrCode: string): Promise<FetchTerminalResponse> {
    return this.executor.get<FetchTerminalResponse>(
      `${this.basePath}/${encodeURIComponent(idOrCode)}`,
    )
  }

  /**
   * Send an event to a terminal.
   *
   * @param idOrCode - The terminal ID or code
   * @param payload - The event payload
   * @returns A promise resolving to the result
   * @see https://paystack.com/docs/api/terminal/#send-event
   */
  sendEvent(
    idOrCode: string,
    payload: SendEventRequest,
  ): Promise<SendEventResponse> {
    return this.executor.post<SendEventResponse>(
      `${this.basePath}/${encodeURIComponent(idOrCode)}/event`,
      payload,
    )
  }
}
