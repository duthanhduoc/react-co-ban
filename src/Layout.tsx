import { useState } from 'react'
import LayoutContext from './LayoutContext'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0)
  return (
    <div className='layout'>
      <div>
        <span>Layout</span>
        <span>
          <button onClick={() => setCount(count + 1)}>+</button>
          <span>{count}</span>
          <button onClick={() => setCount(count - 1)}>-</button>
        </span>
      </div>
      <LayoutContext value={{ count }}>
        <div>{children}</div>
      </LayoutContext>
    </div>
  )
}
