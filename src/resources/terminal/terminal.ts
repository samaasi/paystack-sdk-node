import { BaseResource } from "../base"
import type {
  FetchTerminalResponse,
  ListTerminalsResponse,
  SendEventRequest,
  SendEventResponse,
} from "./terminal.types"

export class TerminalResource extends BaseResource {
  private readonly basePath = "/terminal"

  list(): Promise<ListTerminalsResponse> {
    return this.executor.execute<ListTerminalsResponse>(this.basePath, {
      method: "GET",
    })
  }

  fetch(idOrCode: string): Promise<FetchTerminalResponse> {
    return this.executor.execute<FetchTerminalResponse>(
      `${this.basePath}/${encodeURIComponent(idOrCode)}`,
      {
        method: "GET",
      },
    )
  }

  sendEvent(
    idOrCode: string,
    payload: SendEventRequest,
  ): Promise<SendEventResponse> {
    return this.executor.execute<SendEventResponse>(
      `${this.basePath}/${encodeURIComponent(idOrCode)}/event`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    )
  }
}
