import type {
    ListProductsQuery,
    CreateProductRequest,
    UpdateProductRequest,
    GetProductApiResponse,
    ListProductsApiResponse,
    CreateProductApiResponse,
    UpdateProductApiResponse,
} from "./products.types"
import { BaseResource } from "../base"

export class ProductsResource extends BaseResource {
  private readonly basePath = "/product"

  create(payload: CreateProductRequest): Promise<CreateProductApiResponse> {
    return this.executor.execute<CreateProductApiResponse>(this.basePath, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  list(query: ListProductsQuery = {}): Promise<ListProductsApiResponse> {
    const search = new URLSearchParams()

    if (query.perPage !== undefined) {
      search.set("perPage", String(query.perPage))
    }

    if (query.page !== undefined) {
      search.set("page", String(query.page))
    }

    if (query.from !== undefined) {
      search.set("from", query.from)
    }

    if (query.to !== undefined) {
      search.set("to", query.to)
    }

    const path =
      search.size > 0
        ? `${this.basePath}?${search.toString()}`
        : this.basePath

    return this.executor.execute<ListProductsApiResponse>(path, {
      method: "GET",
    })
  }

  get(id: number): Promise<GetProductApiResponse> {
    const path = `${this.basePath}/${id}`

    return this.executor.execute<GetProductApiResponse>(path, {
      method: "GET",
    })
  }

  update(
    id: number,
    payload: UpdateProductRequest,
  ): Promise<UpdateProductApiResponse> {
    const path = `${this.basePath}/${id}`

    return this.executor.execute<UpdateProductApiResponse>(path, {
      method: "PUT",
      body: JSON.stringify(payload),
    })
  }
}
