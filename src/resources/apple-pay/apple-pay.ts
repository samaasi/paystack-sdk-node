import type {
  RegisterApplePayDomainRequest,
  ListApplePayDomainsApiResponse,
  UnregisterApplePayDomainRequest,
  RegisterApplePayDomainApiResponse,
  UnregisterApplePayDomainApiResponse,
} from "./apple-pay.types"
import { BaseResource } from "../base"

export class ApplePayResource extends BaseResource {
  private readonly basePath = "/apple-pay/domain"

  registerDomain(
    payload: RegisterApplePayDomainRequest,
  ): Promise<RegisterApplePayDomainApiResponse> {
    return this.executor.execute<RegisterApplePayDomainApiResponse>(
      this.basePath,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    )
  }

  listDomains(): Promise<ListApplePayDomainsApiResponse> {
    return this.executor.execute<ListApplePayDomainsApiResponse>(
      this.basePath,
      {
        method: "GET",
      },
    )
  }

  unregisterDomain(
    payload: UnregisterApplePayDomainRequest,
  ): Promise<UnregisterApplePayDomainApiResponse> {
    return this.executor.execute<UnregisterApplePayDomainApiResponse>(
      this.basePath,
      {
        method: "DELETE",
        body: JSON.stringify(payload),
      },
    )
  }
}
