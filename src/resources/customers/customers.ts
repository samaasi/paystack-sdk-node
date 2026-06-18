import { BaseResource } from '../base'
import type {
  ListCustomersQuery,
  CreateCustomerRequest,
  ListCustomersApiResponse,
  UpdateCustomerRequest,
  CreateCustomerApiResponse,
  FetchCustomerApiResponse,
  ValidateCustomerRequest,
  ValidateCustomerApiResponse,
  SetRiskActionRequest,
  SetRiskActionApiResponse,
  DeactivateAuthorizationRequest,
  DeactivateAuthorizationApiResponse,
  Customer,
} from './customers.types'
import { withIdempotencyKey } from '../../utils/idempotency'
import { stringifyQuery } from '../../utils/qs'
import { AutoPaginator, type PaginatorOptions } from '../../utils/pagination'

export interface CreateCustomerOptions {
  idempotencyKey?: string
}

export class CustomersResource extends BaseResource {
  private readonly basePath = '/customer'

  /**
   * Create a customer on your integration.
   *
   * @param payload - The customer creation details (email, first name, last name, etc.)
   * @param options - Optional configuration including idempotency key
   * @returns A promise resolving to the created customer details
   * @see https://paystack.com/docs/api/customer/#create
   */
  create(
    payload: CreateCustomerRequest,
    options: CreateCustomerOptions = {},
  ): Promise<CreateCustomerApiResponse> {
    const init = withIdempotencyKey(
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      options.idempotencyKey,
    )

    return this.executor.execute<CreateCustomerApiResponse>(this.basePath, init)
  }

  /**
   * List customers available on your integration.
   *
   * @param query - The query parameters for filtering (perPage, page)
   * @returns A promise resolving to the list of customers
   * @see https://paystack.com/docs/api/customer/#list
   */
  list(query: ListCustomersQuery = {}): Promise<ListCustomersApiResponse> {
    const qs = stringifyQuery(query as Record<string, unknown>)
    const path = qs ? `${this.basePath}?${qs}` : this.basePath

    return this.executor.get<ListCustomersApiResponse>(path)
  }

  /**
   * List customers available on your integration via an async iterator.
   *
   * @param query - The query parameters for filtering (perPage, page)
   * @returns An async iterator over customers
   */
  listAll(
    query: ListCustomersQuery = {},
  ): AutoPaginator<Customer, ListCustomersQuery> {
    const options: PaginatorOptions<Customer, ListCustomersQuery> = {
      fetchPage: (q) => this.list(q),
      initialQuery: query,
    }

    return new AutoPaginator(options)
  }

  /**
   * Update a customer's details on your integration.
   *
   * @param customerCodeOrEmail - The customer's code or email address
   * @param payload - The fields to update
   * @returns A promise resolving to the updated customer details
   * @see https://paystack.com/docs/api/customer/#update
   */
  update(
    customerCodeOrEmail: string,
    payload: UpdateCustomerRequest,
  ): Promise<CreateCustomerApiResponse> {
    return this.executor.put<CreateCustomerApiResponse>(
      `${this.basePath}/${encodeURIComponent(customerCodeOrEmail)}`,
      payload,
    )
  }

  /**
   * Fetch details of a customer on your integration.
   *
   * @param emailOrCode - An email or customer code for the customer you want to fetch
   * @returns A promise resolving to the customer details
   * @see https://paystack.com/docs/api/customer/#fetch
   */
  fetch(emailOrCode: string): Promise<FetchCustomerApiResponse> {
    return this.executor.get<FetchCustomerApiResponse>(
      `${this.basePath}/${encodeURIComponent(emailOrCode)}`,
    )
  }

  /**
   * Validate a customer's identity.
   *
   * @param customerCodeOrEmail - An email or customer code for the customer you want to validate
   * @param payload - The validation payload
   * @returns A promise resolving to the validation response
   * @see https://paystack.com/docs/api/customer/#validate
   */
  validate(
    customerCodeOrEmail: string,
    payload: ValidateCustomerRequest,
  ): Promise<ValidateCustomerApiResponse> {
    return this.executor.post<ValidateCustomerApiResponse>(
      `${this.basePath}/${encodeURIComponent(customerCodeOrEmail)}/identification`,
      payload,
    )
  }

  /**
   * Whitelist or blacklist a customer on your integration.
   *
   * @param payload - The risk action payload
   * @returns A promise resolving to the updated customer details
   * @see https://paystack.com/docs/api/customer/#set-risk-action
   */
  setRiskAction(
    payload: SetRiskActionRequest,
  ): Promise<SetRiskActionApiResponse> {
    return this.executor.post<SetRiskActionApiResponse>(
      `${this.basePath}/set_risk_action`,
      payload,
    )
  }

  /**
   * Deactivate an authorization when the card needs to be forgotten.
   *
   * @param payload - The authorization deactivation payload
   * @returns A promise resolving to the deactivation response
   * @see https://paystack.com/docs/api/customer/#deactivate-authorization
   */
  deactivateAuthorization(
    payload: DeactivateAuthorizationRequest,
  ): Promise<DeactivateAuthorizationApiResponse> {
    return this.executor.post<DeactivateAuthorizationApiResponse>(
      `${this.basePath}/deactivate_authorization`,
      payload,
    )
  }
}
