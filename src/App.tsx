import { useState } from 'react'

export default function App() {
  const [value, setValue] = useState('')
  console.log('App render')
  return (
    <div className='App'>
      <input
        type='text'
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <h3>Value Input: {value}</h3>
    </div>
  )
}
