import './App.css'
// truthy: số khác 0, string khác rỗng, true, object, array
// falsy: 0, '', false, null, undefined, NaN
function Item({ name, isPacked }: { name: string; isPacked: boolean }) {
  return (
    <li className='item'>
      {name}
      {isPacked && '✅'}
    </li>
  )
}

function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item isPacked={true} name='Space suit' />
        <Item isPacked={true} name='Helmet with a golden leaf' />
        <Item isPacked={false} name='Photo of Tam' />
      </ul>
    </section>
  )
}
function App() {
  return (
    <>
      <PackingList />
    </>
  )
}

export default App
