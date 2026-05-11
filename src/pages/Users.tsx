import { useEffect, useState } from 'react'
import { Link } from 'react-router'

export type User = {
  id: number
  name: string
  username: string
  website: string
  phone: string
  email: string
  company: {
    name: string
  }
  address: {
    city: string
  }
}
// Lần 1: Users khởi tạo -> Gọi API -> Hủy -> Chạy cleanup function để hủy GỌI API
// Lần 2: Users khởi tạo -> Gọi API -> Hủy

export default function Users() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal
    fetch('https://jsonplaceholder.typicode.com/users', { signal })
      .then((res) => res.json())
      .then(setUsers)
      .catch(() => {})

    return () => {
      controller.abort()
    }
  }, [])

  return (
    <div>
      <h1>👥 Danh sách Users</h1>
      <p>
        Data được fetch bằng <strong>loader</strong> — trước khi component
        render.
      </p>
      {/* {users.length === 0 && <p>Đang tải...</p>} */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {users.map((user) => (
          <li
            key={user.id}
            style={{
              marginBottom: '8px',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '6px'
            }}
          >
            <Link to={`/users/${user.id}`}>
              <strong>{user.name}</strong>
            </Link>
            <span style={{ marginLeft: '12px', color: '#666' }}>
              {user.email}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
