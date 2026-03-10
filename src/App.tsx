export default function App() {
  // Currying function
  const handleClick = () => () => {
    alert('Button clicked!')
  }
  return (
    <div className='App'>
      <button onClick={handleClick}>Click me</button>
    </div>
  )
}
