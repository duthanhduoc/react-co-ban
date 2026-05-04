import { useEffect, useState } from 'react'

export default function App() {
  const [count, setCount] = useState(0)
  const [show, setShow] = useState(true)

  // useEffect(() => {
  //   // Effect sẽ chạy 1 lần duy nhất sau khi component được render lần đầu tiên
  //   // Đa số 90% trường hợp sẽ dùng để fetch API
  //   console.log('Chỉ log 1 lần duy nhất thôi')
  // }, [])

  // useEffect(() => {
  //   // Effect sẽ chạy mỗi khi component được render lại
  //   // Trường hợp này hiếm khi được sử dụng
  //   console.log('Log mỗi khi component được render lại, kể cả lần đầu tiên')
  // })

  useEffect(() => {
    // Chạy sau khi App Component render lần đầu tiên
    // Và chạy sau khi mỗi lần show thay đổi
    console.log('Hehe')
  }, [show, count])

  console.log('Render')
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <button onClick={() => setShow(!show)}>Show: {show.toString()}</button>
    </div>
  )
}
