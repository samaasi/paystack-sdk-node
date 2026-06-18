import type {
  Product,
  ListProductsQuery,
  CreateProductRequest,
  UpdateProductRequest,
  GetProductApiResponse,
  ListProductsApiResponse,
  CreateProductApiResponse,
  UpdateProductApiResponse,
} from './products.types'
import { BaseResource } from '../base'
import { stringifyQuery } from '../../utils/qs'
import { AutoPaginator } from '../../utils/pagination'

export class ProductsResource extends BaseResource {
  private readonly basePath = '/product'

  /**
   * Create a product.
   *
   * @param payload - The product creation payload
   * @returns A promise resolving to the created product
   * @see https://paystack.com/docs/api/product/#create
   */
  create(payload: CreateProductRequest): Promise<CreateProductApiResponse> {
    return this.executor.execute<CreateProductApiResponse>(this.basePath, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  /**
   * List products.
   *
   * @param query - The query parameters for filtering
   * @returns A promise resolving to the list of products
   * @see https://paystack.com/docs/api/product/#list
   */
  list(query: ListProductsQuery = {}): Promise<ListProductsApiResponse> {
    const qs = stringifyQuery(query)
    const path = qs ? `${this.basePath}?${qs}` : this.basePath

    return this.executor.execute<ListProductsApiResponse>(path, {
      method: 'GET',
    })
  }

  listAll(query: ListProductsQuery = {}): AutoPaginator<Product, ListProductsQuery> {
    return new AutoPaginator({ fetchPage: (q) => this.list(q), initialQuery: query })
  }

  /**
   * Fetch a product.
   *
   * @param id - The product ID
   * @returns A promise resolving to the product details
   * @see https://paystack.com/docs/api/product/#fetch
   */
  get(id: number): Promise<GetProductApiResponse> {
    const path = `${this.basePath}/${id}`

    return this.executor.execute<GetProductApiResponse>(path, {
      method: 'GET',
    })
  }

  /**
   * Update a product.
   *
   * @param id - The product ID
   * @param payload - The update payload
   * @returns A promise resolving to the updated product
   * @see https://paystack.com/docs/api/product/#update
   */
  update(
    id: number,
    payload: UpdateProductRequest,
  ): Promise<UpdateProductApiResponse> {
    const path = `${this.basePath}/${id}`

    return this.executor.execute<UpdateProductApiResponse>(path, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  }
}
