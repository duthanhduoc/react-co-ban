const HelloWorld = () => {
  return (
    <>
      <div>
        <h1>Hedy Lamarr's Todos</h1>
        <img
          src='https://i.imgur.com/yXOvdOSs.jpg'
          alt='Hedy Lamarr'
          className='photo'
        />
        <hr />
        <ul>
          <li>Invent new traffic lights</li>
          <li>Rehearse a movie scene</li>
          <li>Improve the spectrum technology</li>
        </ul>
      </div>
    </>
  )
}

export default HelloWorld

export function HelloKitty() {
  return <h2>Hello, Kitty!</h2>
}
