import './App.css'
import HelloWorld from './HelloWorld'
import Layout from './Layout'

function App() {
  const title = 'Hello App Component'
  return (
    <>
      <Layout>
        <p>Welcome to React with TypeScript and Vite - by DU THANH DUOC</p>
        <HelloWorld
          title1={title}
          title2='Hi DU THANH DUOC'
          title3='Tam Biet'
        />
      </Layout>
    </>
  )
}

export default App
