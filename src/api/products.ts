import http from '../lib/http'
import type { Product, ProductsResponse } from '../types'

export interface ProductsQuery {
  page?: number
  limit?: number
  search?: string
  sort_by?: 'name' | 'price' | 'stock' | 'created_at'
  order?: 'asc' | 'desc'
}

export interface CreateProductBody {
  name: string
  price: number
  stock?: number
  description?: string
  image?: string
}

export type UpdateProductBody = Partial<CreateProductBody>

export const productsApi = {
  getProducts: async (params: ProductsQuery = {}) => {
    const { data } = await http.get<ProductsResponse>('/products', { params })
    return data
  },
  getProductById: async (id: number) => {
    const { data } = await http.get<{ data: Product }>(`/products/${id}`)
    return data.data
  },
  updateProduct: async (id: number, product: UpdateProductBody) => {
    const { data } = await http.put<{ data: Product }>(
      `/products/${id}`,
      product
    )
    return data.data
  },
  deleteProduct: (id: number) => http.delete(`/products/${id}`),
  createProduct: async (product: CreateProductBody) => {
    const { data } = await http.post<{ data: Product }>(
      '/products',
      product,
      {}
    )
    return data.data
  },
  uploadProductImage: async (image: File) => {
    const formData = new FormData()
    formData.append('image', image)
    const { data } = await http.post<{ data: { image: string } }>(
      '/products/image',
      formData,
      {
        headers: {
          'Content-Type': undefined // Let the browser set the correct Content-Type for FormData
        }
      }
    )
    return data.data.image
  }
}
