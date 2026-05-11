import type { LoaderFunctionArgs } from 'react-router'

const userDetailLoader = async (args: LoaderFunctionArgs) => {
  const userId = args.params.userId
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/users/${userId}`
  )
  const user = await res.json()
  return user
}

export default userDetailLoader
