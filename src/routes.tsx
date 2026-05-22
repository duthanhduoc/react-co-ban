import { createBrowserRouter, Navigate } from 'react-router'
import Layout from './components/Layout'
import Login from './pages/Login'
import ProductsPage from './pages/Products/ProductsPage'
import ProductDetailPage from './pages/Products/ProductDetailPage'

const routes = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to='/products' replace />
  },
  {
    children: [
      {
        path: '/login',
        Component: Login
      }
    ]
  },
  {
    children: [
      {
        Component: Layout,
        path: '/products',
        children: [
          {
            index: true,
            Component: ProductsPage
          },
          {
            path: '/products/:id',
            Component: ProductDetailPage
          }
        ]
      }
    ]
  }
])

export default routes
