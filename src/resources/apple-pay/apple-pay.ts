import type {
  RegisterApplePayDomainRequest,
  ListApplePayDomainsApiResponse,
  UnregisterApplePayDomainRequest,
  RegisterApplePayDomainApiResponse,
  UnregisterApplePayDomainApiResponse,
} from './apple-pay.types'
import { BaseResource } from '../base'

export class ApplePayResource extends BaseResource {
  private readonly basePath = '/apple-pay/domain'

  /**
   * Register a domain for Apple Pay.
   *
   * @param payload - The domain registration details
   * @returns A promise resolving to the registration response
   * @see https://paystack.com/docs/api/apple-pay/#register-domain
   */
  registerDomain(
    payload: RegisterApplePayDomainRequest,
  ): Promise<RegisterApplePayDomainApiResponse> {
    return this.executor.execute<RegisterApplePayDomainApiResponse>(
      this.basePath,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    )
  }

  /**
   * List all registered Apple Pay domains.
   *
   * @returns A promise resolving to the list of domains
   * @see https://paystack.com/docs/api/apple-pay/#list-domains
   */
  listDomains(): Promise<ListApplePayDomainsApiResponse> {
    return this.executor.execute<ListApplePayDomainsApiResponse>(
      this.basePath,
      {
        method: 'GET',
      },
    )
  }

  /**
   * Unregister a domain from Apple Pay.
   *
   * @param payload - The domain unregistration details
   * @returns A promise resolving to the unregistration response
   * @see https://paystack.com/docs/api/apple-pay/#unregister-domain
   */
  unregisterDomain(
    payload: UnregisterApplePayDomainRequest,
  ): Promise<UnregisterApplePayDomainApiResponse> {
    return this.executor.execute<UnregisterApplePayDomainApiResponse>(
      this.basePath,
      {
        method: 'DELETE',
        body: JSON.stringify(payload),
      },
    )
  }
}
