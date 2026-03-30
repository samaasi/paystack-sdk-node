import type {
  SubmitPinRequest,
  SubmitOtpRequest,
  SubmitPhoneRequest,
  CreateChargeRequest,
  SubmitOtpApiResponse,
  SubmitPinApiResponse,
  SubmitAddressRequest,
  SubmitBirthdayRequest,
  SubmitPhoneApiResponse,
  CreateChargeApiResponse,
  SubmitAddressApiResponse,
  SubmitBirthdayApiResponse,
  CheckPendingChargeApiResponse,
} from './charges.types'
import { BaseResource } from '../base'

export class ChargesResource extends BaseResource {
  private readonly basePath = '/charge'

  /**
   * Initiate a payment by creating a charge.
   *
   * @param payload - The charge creation details
   * @returns A promise resolving to the charge creation response
   * @see https://paystack.com/docs/api/charge/#create
   */
  create(payload: CreateChargeRequest): Promise<CreateChargeApiResponse> {
    return this.executor.post<CreateChargeApiResponse>(this.basePath, payload)
  }

  /**
   * Submit OTP to complete a charge.
   *
   * @param payload - The OTP submission details
   * @returns A promise resolving to the OTP submission response
   * @see https://paystack.com/docs/api/charge/#submit-otp
   */
  submitOtp(payload: SubmitOtpRequest): Promise<SubmitOtpApiResponse> {
    const path = `${this.basePath}/submit_otp`

    return this.executor.post<SubmitOtpApiResponse>(path, payload)
  }

  /**
   * Submit PIN to complete a charge.
   *
   * @param payload - The PIN submission details
   * @returns A promise resolving to the PIN submission response
   * @see https://paystack.com/docs/api/charge/#submit-pin
   */
  submitPin(payload: SubmitPinRequest): Promise<SubmitPinApiResponse> {
    const path = `${this.basePath}/submit_pin`

    return this.executor.post<SubmitPinApiResponse>(path, payload)
  }

  /**
   * Submit phone number to complete a charge.
   *
   * @param payload - The phone number submission details
   * @returns A promise resolving to the phone submission response
   * @see https://paystack.com/docs/api/charge/#submit-phone
   */
  submitPhone(payload: SubmitPhoneRequest): Promise<SubmitPhoneApiResponse> {
    const path = `${this.basePath}/submit_phone`

    return this.executor.post<SubmitPhoneApiResponse>(path, payload)
  }

  /**
   * Submit birthday to complete a charge.
   *
   * @param payload - The birthday submission details
   * @returns A promise resolving to the birthday submission response
   * @see https://paystack.com/docs/api/charge/#submit-birthday
   */
  submitBirthday(
    payload: SubmitBirthdayRequest,
  ): Promise<SubmitBirthdayApiResponse> {
    const path = `${this.basePath}/submit_birthday`

    return this.executor.post<SubmitBirthdayApiResponse>(path, payload)
  }

  /**
   * Submit address to complete a charge.
   *
   * @param payload - The address submission details
   * @returns A promise resolving to the address submission response
   * @see https://paystack.com/docs/api/charge/#submit-address
   */
  submitAddress(
    payload: SubmitAddressRequest,
  ): Promise<SubmitAddressApiResponse> {
    const path = `${this.basePath}/submit_address`

    return this.executor.post<SubmitAddressApiResponse>(path, payload)
  }

  /**
   * Check pending charge status.
   *
   * @param reference - The charge reference
   * @returns A promise resolving to the pending charge status
   * @see https://paystack.com/docs/api/charge/#check-pending-charge
   */
  checkPending(reference: string): Promise<CheckPendingChargeApiResponse> {
    const path = `${this.basePath}/${encodeURIComponent(reference)}`

    return this.executor.get<CheckPendingChargeApiResponse>(path)
  }
}
