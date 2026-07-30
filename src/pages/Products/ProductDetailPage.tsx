import { Link, useNavigate, useParams } from 'react-router'
import {
  AlertDialog,
  Button,
  buttonVariants,
  Card,
  Chip,
  ModalBackdrop,
  ModalBody,
  ModalContainer,
  ModalDialog,
  ModalHeader,
  ModalHeading,
  ModalRoot,
  Spinner,
  useOverlayState
} from '@heroui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { productsApi, type UpdateProductBody } from '../../api/products'
import { useEffect, useRef } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'

const inputCls =
  'border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 w-full'
const inputErrCls =
  'border border-red-400 bg-red-50 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-inset focus:ring-red-400 w-full'

const editProductSchema = z.object({
  name: z.string().trim().optional(),
  description: z.string().trim().optional(),
  price: z.coerce.number().min(0, 'Price must be a positive number').optional(),
  stock: z.coerce
    .number()
    .int('Stock must be a whole number')
    .min(0, 'Stock must be a positive number')
    .optional()
})

type EditProductForm = z.infer<typeof editProductSchema>

export default function ProductDetailPage() {
  const navigate = useNavigate()
  const imageInputRef = useRef<HTMLInputElement>(null)
  const qc = useQueryClient()
  const { id } = useParams<{ id: string }>()
  const editState = useOverlayState()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError
  } = useForm({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock: 0
    }
  })
  const { data: product } = useQuery({
    queryKey: ['products', id],
    queryFn: () => productsApi.getProductById(Number(id))
  })

  const uploadImageMutation = useMutation({
    mutationFn: productsApi.uploadProductImage
  })

  const updateProductMutation = useMutation({
    mutationFn: (data: UpdateProductBody) =>
      productsApi.updateProduct(Number(id), data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products', id] })
    }
  })
  const deleteProductMutation = useMutation({
    mutationFn: () => productsApi.deleteProduct(Number(id)),
    onSuccess: () => {
      navigate('/products')
    }
  })

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description ?? '',
        price: product.price,
        stock: product.stock
      })
    }
  }, [product, reset])

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = await uploadImageMutation.mutateAsync(file)
      await updateProductMutation.mutateAsync({ image: imageUrl })
    }
    e.target.value = '' // Reset the input value to allow re-uploading the same file if needed
  }

  const handleDeleteProduct = () => {
    deleteProductMutation.mutateAsync()
  }

  const handleUpdateProduct = async (values: EditProductForm) => {
    try {
      await updateProductMutation.mutateAsync(values)
      editState.close()
    } catch (error) {
      if (
        isAxiosError<{ errors?: Record<string, string>; error?: string }>(error)
      ) {
        const apiErrors = error.response?.data.errors
        const apiError = error.response?.data.error
        if (apiErrors) {
          Object.entries(apiErrors).forEach(([field, message]) => {
            if (field in editProductSchema.shape) {
              setError(field as keyof EditProductForm, {
                type: 'sever',
                message
              })
            }
          })
          return
        }
        setError('root', {
          type: 'sever',
          message: apiError ?? 'Unable to update the product. Please try again.'
        })
      } else {
        setError('root', {
          type: 'sever',
          message: 'Unable to update the product. Please try again.'
        })
      }
    }
  }

  const handleCancelEdit = () => {
    editState.close()
    reset()
  }

  if (!product) {
    return (
      <div className='flex justify-center py-20'>
        <Spinner size='lg' />
      </div>
    )
  }

  if (product) {
    return (
      <div className='max-w-3xl mx-auto'>
        {/* Back / actions */}
        <div className='flex items-center justify-between mb-6'>
          <Link
            className={buttonVariants({ variant: 'ghost' })}
            to={`/products`}
          >
            ← Back to Products
          </Link>

          <div className='flex gap-2'>
            <Button variant='secondary' onPress={editState.open}>
              Edit
            </Button>
            <AlertDialog>
              <Button variant='danger-soft'>Delete</Button>
              <AlertDialog.Backdrop>
                <AlertDialog.Container>
                  <AlertDialog.Dialog className='sm:max-w-[400px]'>
                    <AlertDialog.CloseTrigger />
                    <AlertDialog.Header>
                      <AlertDialog.Icon status='danger' />
                      <AlertDialog.Heading>Delete Product</AlertDialog.Heading>
                    </AlertDialog.Header>
                    <AlertDialog.Body>
                      <p>
                        Are you sure you want to delete {product.name}? This
                        action cannot be undone.
                      </p>
                    </AlertDialog.Body>
                    <AlertDialog.Footer>
                      <Button slot='close' variant='tertiary'>
                        Cancel
                      </Button>
                      <Button
                        slot='close'
                        variant='danger'
                        onPress={handleDeleteProduct}
                      >
                        Delete Product
                      </Button>
                    </AlertDialog.Footer>
                  </AlertDialog.Dialog>
                </AlertDialog.Container>
              </AlertDialog.Backdrop>
            </AlertDialog>
          </div>
        </div>

        <div className='grid gap-6'>
          {/* Image Card */}
          <Card>
            <Card.Header className='flex justify-between items-center px-6 pt-6 pb-2'>
              <h2 className='text-lg font-semibold'>Product Image</h2>
              <Button
                size='sm'
                variant='secondary'
                onPress={() => imageInputRef.current?.click()}
              >
                {uploadImageMutation.isPending
                  ? 'Uploading...'
                  : product.image
                    ? 'Change Image'
                    : 'Upload Image'}
              </Button>
              <input
                type='file'
                placeholder='Upload image'
                className='hidden'
                accept='image/*'
                ref={imageInputRef}
                onChange={handleImageChange}
              />
            </Card.Header>
            <Card.Content className='px-6 pb-6'>
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className='max-h-72 object-contain rounded-xl mx-auto'
                />
              ) : (
                <div className='h-48 bg-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-400 gap-2'>
                  <span className='text-4xl'>🖼️</span>
                  <span className='text-sm'>No image uploaded</span>
                </div>
              )}
            </Card.Content>
          </Card>

          {/* Details Card */}
          <Card>
            <Card.Header className='px-6 pt-6 pb-2'>
              <h2 className='text-lg font-semibold'>Product Details</h2>
            </Card.Header>
            <Card.Content className='px-6 pb-6'>
              <div className='grid grid-cols-2 gap-6'>
                <div>
                  <p className='text-xs text-gray-400 uppercase tracking-wide mb-1'>
                    Name
                  </p>
                  <p className='font-semibold text-gray-900'>{product.name}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-400 uppercase tracking-wide mb-1'>
                    Price
                  </p>
                  <p className='font-semibold text-gray-900 text-xl'>
                    ${product.price.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className='text-xs text-gray-400 uppercase tracking-wide mb-1'>
                    Stock
                  </p>
                  <Chip
                    color={
                      product.stock > 10
                        ? 'success'
                        : product.stock > 0
                          ? 'warning'
                          : 'danger'
                    }
                    variant='soft'
                  >
                    {product.stock} units
                  </Chip>
                </div>
                <div>
                  <p className='text-xs text-gray-400 uppercase tracking-wide mb-1'>
                    Product ID
                  </p>
                  <p className='text-gray-600'>#{product.id}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-400 uppercase tracking-wide mb-1'>
                    Created
                  </p>
                  <p className='text-gray-600'>
                    {new Date(product.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className='text-xs text-gray-400 uppercase tracking-wide mb-1'>
                    Last Updated
                  </p>
                  <p className='text-gray-600'>
                    {new Date(product.updated_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                {product.description && (
                  <div className='col-span-2'>
                    <p className='text-xs text-gray-400 uppercase tracking-wide mb-1'>
                      Description
                    </p>
                    <p className='text-gray-700'>{product.description}</p>
                  </div>
                )}
              </div>
            </Card.Content>
          </Card>

          {/* Edit Form Card */}
          <ModalRoot state={editState}>
            <ModalBackdrop>
              <ModalContainer>
                <ModalDialog>
                  <ModalHeader>
                    <ModalHeading>Edit Product</ModalHeading>
                  </ModalHeader>
                  <ModalBody>
                    <form
                      className='flex flex-col gap-4'
                      noValidate
                      onSubmit={handleSubmit(handleUpdateProduct, (e) => {
                        console.log(e)
                      })}
                    >
                      <div className='flex flex-col gap-1'>
                        <label
                          htmlFor='edit-product-name'
                          className='text-sm font-medium text-gray-700'
                        >
                          Name
                        </label>
                        <input
                          id='edit-product-name'
                          type='text'
                          className={errors.name ? inputErrCls : inputCls}
                          {...register('name')}
                        />
                        {errors.name && (
                          <p className='text-xs text-red-500'>
                            {errors.name.message}
                          </p>
                        )}
                      </div>
                      <div className='flex flex-col gap-1'>
                        <label
                          htmlFor='edit-product-description'
                          className='text-sm font-medium text-gray-700'
                        >
                          Description
                        </label>
                        <textarea
                          id='edit-product-description'
                          rows={3}
                          className='border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 w-full resize-none'
                          {...register('description')}
                        />
                        {errors.description && (
                          <p className='text-xs text-red-500'>
                            {errors.description.message}
                          </p>
                        )}
                      </div>
                      <div className='flex flex-col gap-1'>
                        <label
                          htmlFor='edit-product-price'
                          className='text-sm font-medium text-gray-700'
                        >
                          Price
                        </label>
                        <input
                          id='edit-product-price'
                          type='number'
                          className={errors.price ? inputErrCls : inputCls}
                          {...register('price')}
                        />
                        {errors.price && (
                          <p className='text-xs text-red-500'>
                            {errors.price.message}
                          </p>
                        )}
                      </div>
                      <div className='flex flex-col gap-1'>
                        <label
                          htmlFor='edit-product-stock'
                          className='text-sm font-medium text-gray-700'
                        >
                          Stock
                        </label>
                        <input
                          id='edit-product-stock'
                          type='number'
                          className={errors.stock ? inputErrCls : inputCls}
                          {...register('stock')}
                        />
                        {errors.stock && (
                          <p className='text-xs text-red-500'>
                            {errors.stock.message}
                          </p>
                        )}
                      </div>
                      {errors.root && (
                        <p className='text-xs text-red-500'>
                          {errors.root.message}
                        </p>
                      )}
                      <div className='flex justify-end gap-2'>
                        <Button
                          type='button'
                          variant='ghost'
                          onPress={handleCancelEdit}
                        >
                          Cancel
                        </Button>
                        <Button type='submit' variant='primary'>
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </ModalBody>
                </ModalDialog>
              </ModalContainer>
            </ModalBackdrop>
          </ModalRoot>
        </div>
      </div>
    )
  }
}
