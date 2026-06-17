import type { ApiResponse } from '../resources/base'

export interface PaginatorOptions<T, Q> {
  fetchPage: (query: Q) => Promise<ApiResponse<T[]>>
  initialQuery: Q
}

export class AutoPaginator<
  T,
  Q extends { page?: number; perPage?: number },
> implements AsyncIterableIterator<T> {
  private currentPage = 1
  private currentItems: T[] = []
  private itemIndex = 0
  private hasMorePages = true
  private fetchedFirstPage = false

  constructor(private options: PaginatorOptions<T, Q>) {
    this.currentPage = options.initialQuery.page ?? 1
  }

  private async fetchNextPage(): Promise<void> {
    const query = {
      ...this.options.initialQuery,
      page: this.currentPage,
    }

    const response = await this.options.fetchPage(query)

    this.currentItems = response.data ?? []
    this.itemIndex = 0
    this.fetchedFirstPage = true

    if (response.meta) {
      this.hasMorePages = this.currentPage < response.meta.pageCount
    } else {
      // If no meta is provided, we assume no more pages if current items length is 0
      this.hasMorePages = false
    }

    this.currentPage++
  }

  public async next(): Promise<IteratorResult<T>> {
    if (
      !this.fetchedFirstPage ||
      (this.itemIndex >= this.currentItems.length && this.hasMorePages)
    ) {
      await this.fetchNextPage()
    }

    if (this.itemIndex < this.currentItems.length) {
      const value = this.currentItems[this.itemIndex++]
      return { value: value as T, done: false }
    }

    return { value: undefined, done: true }
  }

  [Symbol.asyncIterator](): AsyncIterableIterator<T> {
    return this
  }
}
