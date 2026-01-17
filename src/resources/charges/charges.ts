import { BaseResource } from "../base"
import type {
  CheckPendingChargeApiResponse,
  CreateChargeApiResponse,
  CreateChargeRequest,
  SubmitAddressApiResponse,
  SubmitAddressRequest,
  SubmitBirthdayApiResponse,
  SubmitBirthdayRequest,
  SubmitOtpApiResponse,
  SubmitOtpRequest,
  SubmitPhoneApiResponse,
  SubmitPhoneRequest,
  SubmitPinApiResponse,
  SubmitPinRequest,
} from "./charges.types"

export class ChargesResource extends BaseResource {
  private readonly basePath = "/charge"

  create(payload: CreateChargeRequest): Promise<CreateChargeApiResponse> {
    return this.executor.execute<CreateChargeApiResponse>(this.basePath, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  submitOtp(payload: SubmitOtpRequest): Promise<SubmitOtpApiResponse> {
    const path = `${this.basePath}/submit_otp`

    return this.executor.execute<SubmitOtpApiResponse>(path, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  submitPin(payload: SubmitPinRequest): Promise<SubmitPinApiResponse> {
    const path = `${this.basePath}/submit_pin`

    return this.executor.execute<SubmitPinApiResponse>(path, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

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

  submitAddress(
    payload: SubmitAddressRequest,
  ): Promise<SubmitAddressApiResponse> {
    const path = `${this.basePath}/submit_address`

    return this.executor.execute<SubmitAddressApiResponse>(path, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  checkPending(reference: string): Promise<CheckPendingChargeApiResponse> {
    const path = `${this.basePath}/${encodeURIComponent(reference)}`

    return this.executor.execute<CheckPendingChargeApiResponse>(path, {
      method: "GET",
    })
  }
}
