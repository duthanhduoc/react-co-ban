import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const obj = {
    title: 'React 2026 by Dư Thanh Được',
    subTitle: 'Learning React with Vite',
  }
  const href = 'https://react.dev'
  useEffect(() => {
    console.log(count)
  }, [])

  return (
    <>
      <div>
        <a
          href='https://vite.dev'
          target='_blank'
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
          }}
        >
          <img src={viteLogo} className='logo' alt='Vite logo' />
        </a>
        <a href={href} target='_blank'>
          <img src={reactLogo} className='logo react' alt='React logo' />
        </a>
      </div>
      <h1>{obj.title}</h1>
      <h2>{obj.subTitle}</h2>
      <div className='card'>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className='read-the-docs'>
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
