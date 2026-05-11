import { RouterProvider } from 'react-router'
import routes from './routes'

export default function App() {
  return (
    <div>
      <RouterProvider router={routes} />
    </div>
  )
}
