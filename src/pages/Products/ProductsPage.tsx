import {
  Button,
  Chip,
  Pagination,
  TableRoot,
  TableScrollContainer,
  TableContent,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  ModalRoot,
  ModalBackdrop,
  ModalContainer,
  ModalDialog,
  ModalHeader,
  ModalHeading,
  ModalBody,
  ModalFooter,
  useOverlayState,
  buttonVariants
} from '@heroui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  productsApi,
  type CreateProductBody,
  type ProductsQuery
} from '../../api/products'
import { Link, useSearchParams } from 'react-router'
import { useRef, useState } from 'react'

const SORT_OPTIONS = [
  { value: 'created_at', label: 'Date Created' },
  { value: 'name', label: 'Name' },
  { value: 'price', label: 'Price' },
  { value: 'stock', label: 'Stock' }
]

const LIMIT = 10
const inputCls =
  'border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 w-full'

const inputErrCls =
  'border border-red-400 bg-red-50 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-inset focus:ring-red-400 w-full'
const LIMIT_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
export default function ProductsPage() {
  const qc = useQueryClient()
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: ''
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const createState = useOverlayState()
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page') ?? 1)
  const searchFromUrl = searchParams.get('search') ?? ''
  const sortBy = (searchParams.get('sortBy') ?? 'created_at') as NonNullable<
    ProductsQuery['sort_by']
  >
  const order = (searchParams.get('order') ?? 'desc') as NonNullable<
    ProductsQuery['order']
  >
  const [searchInput, setSearchInput] = useState(searchFromUrl)
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const previewImageUrl = imageFile ? URL.createObjectURL(imageFile) : null
  const { data } = useQuery({
    queryKey: [
      'products',
      { page, limit: LIMIT, search: searchFromUrl, order, sortBy }
    ],
    queryFn: () =>
      productsApi.getProducts({
        page,
        limit: LIMIT,
        search: searchFromUrl,
        order,
        sort_by: sortBy
      })
  })

  const createProductMutation = useMutation({
    mutationFn: productsApi.createProduct
  })

  const uploadImageMutation = useMutation({
    mutationFn: productsApi.uploadProductImage
  })

  const products = data?.data ?? []
  const totalProducts = data?.pagination.total ?? 0
  const totalPages = data?.pagination.totalPages ?? 0

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []
    pages.push(1)
    if (page > 3) {
      pages.push('ellipsis')
    }
    const start = Math.max(2, page - 1)
    const end = Math.min(totalPages - 1, page + 1)
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    if (page < totalPages - 2) {
      pages.push('ellipsis')
    }
    pages.push(totalPages)
    return pages
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchInput(value)
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current)
    }
    searchTimerRef.current = setTimeout(() => {
      updateParams({ page: '1', search: value })
    }, 500)
  }

  const updateParams = (updates: Record<string, string | null>) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null) {
          next.delete(key)
        } else {
          next.set(key, value)
        }
      })
      return next
    })
  }

  const handleCreateProduct = async () => {
    const errors: Record<string, string> = {}
    const price = Number(form.price)
    const stock = form.stock === '' ? 0 : Number(form.stock)
    if (form.price.trim() === '') {
      errors.price = 'Price is required'
    }
    if (price < 0) {
      errors.price = 'Price cannot be negative'
    }
    if (form.name.trim() === '') {
      errors.name = 'Name is required'
    }
    if (!Number.isInteger(stock) || stock < 0) {
      errors.stock = 'Invalid stock value'
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    const body: CreateProductBody = {
      name: form.name,
      description: form.description,
      price: Number(form.price) || 0,
      stock: Number(form.stock) || 0
    }
    if (imageFile) {
      if (imageFile.size > LIMIT_IMAGE_SIZE) {
        setFormErrors((prev) => ({
          ...prev,
          image: 'Image size must be less than 5MB'
        }))
        return
      }
      body.image = await uploadImageMutation.mutateAsync(imageFile)
    }
    await createProductMutation.mutateAsync(body)
    resetForm()
    createState.close()
    qc.invalidateQueries({ queryKey: ['products'] })
  }

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      price: '',
      stock: ''
    })
    setFormErrors({})
    setImageFile(null)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setImageFile(file)
  }
  return (
    <div>
      {/* Header */}
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Products</h1>
          <p className='text-sm text-gray-500 mt-1'>
            {totalProducts} total products
          </p>
        </div>
        <Button variant='primary' onPress={createState.open}>
          + Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className='flex flex-wrap items-center gap-3 mb-4'>
        <input
          type='text'
          placeholder='Search by name...'
          className='border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 max-w-xs w-full'
          value={searchInput}
          onChange={handleSearchInputChange}
        />
        <select
          className='border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 bg-white'
          value={sortBy}
          onChange={(e) =>
            updateParams({
              page: '1',
              sortBy: e.target.value
            })
          }
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <Button
          variant='outline'
          size='sm'
          onPress={() =>
            updateParams({
              page: '1',
              order: order === 'asc' ? 'desc' : 'asc'
            })
          }
        >
          {order === 'asc' ? '↑ Ascending' : '↓ Descending'}
        </Button>
      </div>

      {/* Table */}
      <TableRoot className='bg-transparent'>
        <TableScrollContainer>
          <TableContent
            aria-label='Products table'
            className='rounded-xl border border-gray-200 overflow-hidden bg-white'
          >
            <TableHeader>
              <TableColumn id='image'>IMAGE</TableColumn>
              <TableColumn id='name' isRowHeader>
                NAME
              </TableColumn>
              <TableColumn id='price'>PRICE</TableColumn>
              <TableColumn id='stock'>STOCK</TableColumn>
              <TableColumn id='created'>CREATED</TableColumn>
              <TableColumn id='actions'>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} id={product.id}>
                  <TableCell>
                    {product.image ? (
                      <img
                        alt={product.name}
                        className='w-12 h-12 rounded-lg object-cover'
                        src={product.image}
                      />
                    ) : (
                      <div className='w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400'>
                        No img
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className='font-medium text-gray-900'>
                      {product.name}
                    </span>
                    {product.description && (
                      <p className='text-xs text-gray-400 mt-0.5 max-w-xs truncate'>
                        {product.description}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className='font-semibold'>
                      ${product.price.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={
                        product.stock > 10
                          ? 'success'
                          : product.stock > 0
                            ? 'warning'
                            : 'danger'
                      }
                      size='sm'
                      variant='soft'
                    >
                      {product.stock}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <span className='text-sm text-gray-500'>
                      {new Date(product.created_at).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className='flex gap-2'>
                      <Link
                        to={`/products/${product.id}`}
                        className={buttonVariants({
                          size: 'sm',
                          variant: 'secondary'
                        })}
                      >
                        View
                      </Link>

                      <Button size='sm' variant='danger-soft'>
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TableContent>
        </TableScrollContainer>
      </TableRoot>

      {/* Pagination */}
      <div className='mt-6'>
        <Pagination className='w-full'>
          <Pagination.Summary>
            Showing {Math.min((page - 1) * LIMIT + 1, totalProducts)}–
            {Math.min(page * LIMIT, totalProducts)} of {totalProducts} results
          </Pagination.Summary>
          <Pagination.Content>
            <Pagination.Item>
              <Pagination.Previous
                isDisabled={page === 1}
                onPress={() => setSearchParams({ page: String(page - 1) })}
              >
                <Pagination.PreviousIcon />
                <span>Previous</span>
              </Pagination.Previous>
            </Pagination.Item>
            {getPageNumbers().map((p, i) =>
              p === 'ellipsis' ? (
                <Pagination.Item key={`ellipsis-${i}`}>
                  <Pagination.Ellipsis />
                </Pagination.Item>
              ) : (
                <Pagination.Item key={p}>
                  <Pagination.Link
                    isActive={p === page}
                    onPress={() => setSearchParams({ page: String(p) })}
                  >
                    {p}
                  </Pagination.Link>
                </Pagination.Item>
              )
            )}
            <Pagination.Item>
              <Pagination.Next
                isDisabled={page >= totalPages}
                onPress={() => setSearchParams({ page: String(page + 1) })}
              >
                <span>Next</span>
                <Pagination.NextIcon />
              </Pagination.Next>
            </Pagination.Item>
          </Pagination.Content>
        </Pagination>
      </div>

      {/* Create Product Modal */}
      <ModalRoot state={createState}>
        <ModalBackdrop>
          <ModalContainer>
            <ModalDialog>
              <ModalHeader>
                <ModalHeading>Add New Product</ModalHeading>
              </ModalHeader>
              <ModalBody>
                <div className='flex flex-col gap-4'>
                  <div className='flex flex-col gap-1'>
                    <label className='text-sm font-medium text-gray-700'>
                      Name <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='text'
                      placeholder='Product name'
                      className={formErrors.name ? inputErrCls : inputCls}
                      value={form.name}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, name: e.target.value }))
                      }
                    />
                    {formErrors.name && (
                      <p className='text-xs text-red-500'>{formErrors.name}</p>
                    )}
                  </div>
                  <div className='flex flex-col gap-1'>
                    <label className='text-sm font-medium text-gray-700'>
                      Image
                    </label>
                    <input
                      type='file'
                      placeholder='Upload image'
                      className={formErrors.image ? inputErrCls : inputCls}
                      accept='image/*'
                      ref={imageInputRef}
                      onChange={handleImageChange}
                    />
                    {formErrors.image && (
                      <p className='text-xs text-red-500'>{formErrors.image}</p>
                    )}
                    {previewImageUrl && (
                      <div>
                        <img
                          alt='Preview'
                          className='w-[150px] h-[150px] rounded-lg object-cover'
                          src={previewImageUrl}
                        />
                        <Button
                          size='sm'
                          variant='danger-soft'
                          onPress={() => {
                            setImageFile(null)
                            if (imageInputRef.current) {
                              imageInputRef.current.value = ''
                            }
                          }}
                        >
                          Remove Image
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className='flex flex-col gap-1'>
                    <label className='text-sm font-medium text-gray-700'>
                      Description
                    </label>
                    <input
                      type='text'
                      placeholder='Optional description'
                      className={
                        formErrors.description ? inputErrCls : inputCls
                      }
                      value={form.description}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          description: e.target.value
                        }))
                      }
                    />
                    {formErrors.description && (
                      <p className='text-xs text-red-500'>
                        {formErrors.description}
                      </p>
                    )}
                  </div>
                  <div className='flex flex-col gap-1'>
                    <label className='text-sm font-medium text-gray-700'>
                      Price <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='number'
                      placeholder='0.00'
                      className={formErrors.price ? inputErrCls : inputCls}
                      value={form.price}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, price: e.target.value }))
                      }
                    />
                    {formErrors.price && (
                      <p className='text-xs text-red-500'>{formErrors.price}</p>
                    )}
                  </div>
                  <div className='flex flex-col gap-1'>
                    <label className='text-sm font-medium text-gray-700'>
                      Stock
                    </label>
                    <input
                      type='number'
                      placeholder='0'
                      className={formErrors.stock ? inputErrCls : inputCls}
                      value={form.stock}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, stock: e.target.value }))
                      }
                    />
                    {formErrors.stock && (
                      <p className='text-xs text-red-500'>{formErrors.stock}</p>
                    )}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant='ghost'
                  onPress={() => {
                    resetForm()
                    createState.close()
                  }}
                >
                  Cancel
                </Button>
                <Button variant='primary' onPress={handleCreateProduct}>
                  Create Product
                </Button>
              </ModalFooter>
            </ModalDialog>
          </ModalContainer>
        </ModalBackdrop>
      </ModalRoot>
    </div>
  )
}
