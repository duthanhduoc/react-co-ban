## 3 Mode của React Router

React Router có 3 mode chính:

---

### 1. Framework Mode

```tsx
// Dùng Vite plugin + file-based routing
// vite.config.ts
import { reactRouter } from '@react-router/dev/vite'
```

- Full-stack: hỗ trợ **SSR**, **SSG**
- File-based routing (giống Next.js)
- Có loaders/actions chạy trên server
- Về bản chất đây là **Remix** được đổi tên

---

### 2. Data Mode

```tsx
import { createBrowserRouter, RouterProvider } from "react-router"

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/about", element: <About />, loader: fetchData },
])

<RouterProvider router={router} />
```

- **Client-side only** (SPA)
- Có `loader`, `action`, `errorElement`
- Cấu hình route bằng object array

---

### 3. Declarative Mode

```tsx
import { BrowserRouter, Routes, Route } from 'react-router'
;<BrowserRouter>
  <Routes>
    <Route path='/' element={<Home />} />
    <Route path='/about' element={<About />} />
  </Routes>
</BrowserRouter>
```

- **Client-side only** (SPA)
- Cú pháp JSX truyền thống từ v5/v6
- Không có `loader`/`action`

---

## Nên chọn mode nào cho CSR?

Vì bạn chỉ muốn **React client-side rendering** → chọn **Data Mode**.

|                  | Declarative | **Data Mode** |
| ---------------- | ----------- | ------------- |
| CSR              | ✅          | ✅            |
| Loader / Action  | ❌          | ✅            |
| Nested routes    | Khó         | Dễ            |
| Được khuyên dùng | ❌          | ✅            |

**Data Mode** là lựa chọn được React Router khuyến nghị cho SPA — vừa đơn giản, vừa có đầy đủ tính năng như `loader` để fetch data trước khi render route.
