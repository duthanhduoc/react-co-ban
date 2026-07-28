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
import { mockProducts } from '../../data/products'
import { useQuery } from '@tanstack/react-query'
import { productsApi } from '../../api/products'

const inputCls =
  'border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 w-full'

export default function ProductDetailPage() {
  // const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const editState = useOverlayState()
  const { data: product } = useQuery({
    queryKey: ['products', id],
    queryFn: () => productsApi.getProductById(Number(id))
  })

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
                      <Button slot='close' variant='danger'>
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
              <Button size='sm' variant='secondary'>
                Upload Image
              </Button>
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
                    <div className='flex flex-col gap-4'>
                      <div className='flex flex-col gap-1'>
                        <label className='text-sm font-medium text-gray-700'>
                          Name
                        </label>
                        <input
                          type='text'
                          defaultValue={product.name}
                          className={inputCls}
                        />
                      </div>
                      <div className='flex flex-col gap-1'>
                        <label className='text-sm font-medium text-gray-700'>
                          Description
                        </label>
                        <textarea
                          defaultValue={product.description ?? ''}
                          rows={3}
                          className='border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 w-full resize-none'
                        />
                      </div>
                      <div className='flex flex-col gap-1'>
                        <label className='text-sm font-medium text-gray-700'>
                          Price
                        </label>
                        <input
                          type='number'
                          defaultValue={product.price}
                          className={inputCls}
                        />
                      </div>
                      <div className='flex flex-col gap-1'>
                        <label className='text-sm font-medium text-gray-700'>
                          Stock
                        </label>
                        <input
                          type='number'
                          defaultValue={product.stock}
                          className={inputCls}
                        />
                      </div>
                      <div className='flex justify-end gap-2'>
                        <Button variant='ghost' onPress={editState.close}>
                          Cancel
                        </Button>
                        <Button variant='primary'>Save Changes</Button>
                      </div>
                    </div>
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
