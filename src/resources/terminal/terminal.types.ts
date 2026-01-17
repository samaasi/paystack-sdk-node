import type { ApiResponse } from "../base"

export type TerminalStatus = "active" | "inactive"

export interface Terminal {
  id: number
  serial_number: string
  device_code: string
  status: TerminalStatus
  [key: string]: unknown
}

export type ListTerminalsResponse = ApiResponse<Terminal[]>

export interface FetchTerminalResponseData extends Terminal {
  pending_queue: number
}

export type FetchTerminalResponse = ApiResponse<FetchTerminalResponseData>

export interface SendEventRequest {
  type: string
  action: string
  [key: string]: unknown
}

export type SendEventResponse = ApiResponse<unknown>
