import { useState } from 'react'

export default function App() {
  const [person, setPerson] = useState({
    name: 'Dư Thanh Được',
    position: {
      title: 'Giám đốc',
      salary: 1000000,
    },
  })

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const newPerson = { ...person }
    newPerson.name = value
    setPerson(newPerson)
  }

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    const newPerson = {
      ...person,
      position: { ...person.position, title: value },
    }
    setPerson(newPerson)
  }

  const handleChangeSalary = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    const newPerson = {
      ...person,
      position: { ...person.position, salary: Number(value) },
    }
    setPerson(newPerson)
  }

  return (
    <div>
      <form>
        <input value={person.name} name='name' onChange={handleChangeName} />
        <input
          value={person.position.title}
          name='title'
          onChange={handleChangeTitle}
        />
        <input
          value={person.position.salary}
          name='salary'
          onChange={handleChangeSalary}
        />
      </form>
    </div>
  )
}
