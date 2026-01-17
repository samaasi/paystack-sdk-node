import { BaseResource } from "../base"
import type {
  CreateSubaccountRequest,
  CreateSubaccountResponse,
  FetchSubaccountResponse,
  ListSubaccountsResponse,
  UpdateSubaccountRequest,
  UpdateSubaccountResponse,
} from "./subaccounts.types"

export class SubaccountsResource extends BaseResource {
  private readonly basePath = "/subaccount"

  create(
    payload: CreateSubaccountRequest,
  ): Promise<CreateSubaccountResponse> {
    return this.executor.execute<CreateSubaccountResponse>(this.basePath, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  list(): Promise<ListSubaccountsResponse> {
    return this.executor.execute<ListSubaccountsResponse>(this.basePath, {
      method: "GET",
    })
  }

  fetch(codeOrId: string | number): Promise<FetchSubaccountResponse> {
    const id = String(codeOrId)

    return this.executor.execute<FetchSubaccountResponse>(
      `${this.basePath}/${encodeURIComponent(id)}`,
      {
        method: "GET",
      },
    )
  }

  update(
    code: string,
    payload: UpdateSubaccountRequest,
  ): Promise<UpdateSubaccountResponse> {
    return this.executor.execute<UpdateSubaccountResponse>(
      `${this.basePath}/${encodeURIComponent(code)}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
    )
  }
}
