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

export const productsApi = {
  getProducts: async (params: ProductsQuery = {}) => {
    const { data } = await http.get<ProductsResponse>('/products', { params })
    return data
  },
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
      { headers: { 'Content-Type': undefined } }
    )
    return data.data.image
  }
}
