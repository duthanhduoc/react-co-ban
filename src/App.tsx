import { useEffect, useState } from 'react'

const Child = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Log mỗi 1 giây')
    }, 1000)

    // Cleanup function: Dùng khi lắng nghe sự kiện, hoặc khi sử dụng setInterval, setTimeout,... để tránh bị rò rỉ bộ nhớ
    // Nó sẽ chạy khi mà component Child bị unmount (bị tắt)
    return () => {
      clearInterval(interval)
    }
  }, [])
  return <div>Child</div>
}

export default function App() {
  const [count, setCount] = useState(0)
  const [show, setShow] = useState(true)

  // useEffect(() => {
  //   console.log('Log 1 lần duy nhất khi component được render lần đầu tiên')
  // }, [])

  // console.log('Render')
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <button onClick={() => setShow(!show)}>Show: {show.toString()}</button>
      {show && <Child />}
    </div>
  )
}
