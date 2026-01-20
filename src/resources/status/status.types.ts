export type StatusIndicator = 'none' | 'minor' | 'major' | 'critical'

export interface StatusSummaryStatus {
  indicator: StatusIndicator
  description: string
}

export interface StatusSummaryResponse {
  page?: Record<string, unknown>
  components?: Array<Record<string, unknown>>
  incidents?: Array<Record<string, unknown>>
  scheduled_maintenances?: Array<Record<string, unknown>>
  status: StatusSummaryStatus
}
