import { Fragment } from 'react/jsx-runtime'
import './App.css'

const people = [
  'Creola Katherine Johnson: mathematician',
  'Subrahmanyan Chandrasekhar: astrophysicist',
  'Mario José Molina-Pasquel Henríquez: chemist',
  'Mohammad Abdus Salam: physicist',
  'Percy Lavon Julian: chemist',
  'Subrahmanyan Chandrasekhar: astrophysicist',
]

function App() {
  return (
    <ul>
      {people.map((person, index) => (
        <Fragment key={index}>
          <div>Số thứ tự: {index + 1}</div>
          <li>{person}</li>
        </Fragment>
      ))}
      {/* <li>Creola Katherine Johnson: mathematician</li>
      <li>Mario José Molina-Pasquel Henríquez: chemist</li>
      <li>Mohammad Abdus Salam: physicist</li>
      <li>Percy Lavon Julian: chemist</li>
      <li>Subrahmanyan Chandrasekhar: astrophysicist</li> */}
    </ul>
  )
}

export default App
