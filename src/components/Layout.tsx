import { NavLink, Outlet, useNavigation } from 'react-router'

export default function Layout() {
  const navigation = useNavigation()
  const isNavigating = Boolean(navigation.location)
  return (
    <div>
      <nav
        style={{
          display: 'flex',
          gap: '16px',
          padding: '12px',
          background: '#f0f0f0'
        }}
      >
        <NavLink to='/' end>
          Home
        </NavLink>
        <NavLink to='/about' end>
          About
        </NavLink>
        <NavLink to='/users' end>
          Users
        </NavLink>
      </nav>
      <main style={{ padding: '24px' }}>
        {isNavigating ? <p>Đang chuyển trang...</p> : <Outlet />}
      </main>
    </div>
  )
}
