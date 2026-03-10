import { useState } from 'react'

export default function App() {
  const [number, setNumber] = useState(0)
  console.log('App rendered')
  return (
    <>
      <h1>{number}</h1>
      <button
        onClick={() => {
          setNumber(number + 3)
          alert(number)
        }}
      >
        +3
      </button>
    </>
  )
}
