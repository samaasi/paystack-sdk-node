import type { ApiResponse } from '../base'

export interface ApplePayDomainList {
  domainNames: string[]
}

export interface RegisterApplePayDomainRequest {
  domainName: string
}

export interface UnregisterApplePayDomainRequest {
  domainName: string
}

export type RegisterApplePayDomainApiResponse = ApiResponse<null>

export type ListApplePayDomainsApiResponse = ApiResponse<ApplePayDomainList>

export type UnregisterApplePayDomainApiResponse = ApiResponse<null>
