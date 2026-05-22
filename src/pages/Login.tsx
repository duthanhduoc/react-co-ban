import { Button, Card } from '@heroui/react'

export default function Login() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100'>
      <Card className='w-full max-w-sm shadow-xl'>
        <Card.Header className='flex flex-col items-start gap-1 pb-0 px-6 pt-6'>
          <h1 className='text-2xl font-bold text-gray-800'>Welcome back</h1>
          <p className='text-sm text-gray-500'>Sign in to Product Manager</p>
        </Card.Header>
        <Card.Content className='px-6 pb-6 pt-4'>
          <form className='flex flex-col gap-4'>
            <div className='flex flex-col gap-1'>
              <label
                htmlFor='username'
                className='text-sm font-medium text-gray-700'>
                Username
              </label>
              <input
                id='username'
                type='text'
                placeholder='Enter your username'
                autoComplete='username'
                className='border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>

            <div className='flex flex-col gap-1'>
              <label
                htmlFor='password'
                className='text-sm font-medium text-gray-700'>
                Password
              </label>
              <input
                id='password'
                type='password'
                placeholder='Enter your password'
                autoComplete='current-password'
                className='border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>

            <Button type='submit' variant='primary' className='mt-2 w-full'>
              Sign In
            </Button>
          </form>
        </Card.Content>
      </Card>
    </div>
  )
}
