import { Link, useLoaderData, useParams } from 'react-router'
import type { User } from '../Users'

export default function UserDetail() {
  const { userId } = useParams()
  const user = useLoaderData<User>()

  return (
    <div>
      <Link to='/users'>← Quay lại danh sách</Link>
      <h1>👤 Chi tiết User #{userId}</h1>
      {user && (
        <div>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Phone:</strong> {user.phone}
          </p>
          <p>
            <strong>Website:</strong> {user.website}
          </p>
          <p>
            <strong>Company:</strong> {user.company.name}
          </p>
          <p>
            <strong>City:</strong> {user.address.city}
          </p>
        </div>
      )}
    </div>
  )
}
