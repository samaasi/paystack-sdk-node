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
} from "./charges.types"
import { BaseResource } from "../base"

export class ChargesResource extends BaseResource {
  private readonly basePath = "/charge"

  /**
   * Initiate a payment by creating a charge.
   *
   * @param payload - The charge creation details
   * @returns A promise resolving to the charge creation response
   * @see https://paystack.com/docs/api/charge/#create
   */
  create(payload: CreateChargeRequest): Promise<CreateChargeApiResponse> {
    return this.executor.execute<CreateChargeApiResponse>(this.basePath, {
      method: "POST",
      body: JSON.stringify(payload),
    })
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

    return this.executor.execute<SubmitOtpApiResponse>(path, {
      method: "POST",
      body: JSON.stringify(payload),
    })
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

    return this.executor.execute<SubmitPinApiResponse>(path, {
      method: "POST",
      body: JSON.stringify(payload),
    })
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

    return this.executor.execute<SubmitPhoneApiResponse>(path, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  submitBirthday(
    payload: SubmitBirthdayRequest,
  ): Promise<SubmitBirthdayApiResponse> {
    const path = `${this.basePath}/submit_birthday`

    return this.executor.execute<SubmitBirthdayApiResponse>(path, {
      method: "POST",
      body: JSON.stringify(payload),
    })
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

    return this.executor.execute<SubmitAddressApiResponse>(path, {
      method: "POST",
      body: JSON.stringify(payload),
    })
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

    return this.executor.execute<CheckPendingChargeApiResponse>(path, {
      method: "GET",
    })
  }
}
