import { createBrowserRouter } from 'react-router'
import Layout from './components/Layout'
import Home from './pages/Home'
import Users from './pages/Users'
import About from './pages/About'
import UserDetail from './pages/UserDetail/UserDetail'
import userDetailLoader from './pages/UserDetail/userDetailLoader'

const routes = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      {
        index: true,
        Component: Home
      },
      {
        path: 'about',
        Component: About
      },
      {
        path: 'users',
        children: [
          {
            index: true,
            Component: Users
          },
          {
            path: ':userId',
            Component: UserDetail,
            loader: userDetailLoader
          }
        ]
      }
    ]
  }
])

export default routes
