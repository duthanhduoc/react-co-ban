import { useState } from 'react'

type Artist = {
  id: string
  name: string
}

export default function App() {
  const [name, setName] = useState('')
  const [artists, setArtists] = useState<Artist[]>([])

  console.log('artists', artists)

  const handleRemoveArtist = (artistId: string) => () => {
    const newArtists = artists.filter((artist) => artist.id !== artistId)
    setArtists(newArtists)
  }

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button
        onClick={() => {
          // 🚫
          // artists.push({ id: artists.length + 1, name })
          // setArtists(artists)

          // ✅
          const newArtists = [...artists]
          newArtists.push({ id: new Date().toISOString(), name })
          setArtists(newArtists)
          setName('')
        }}
      >
        Add
      </button>
      <ul>
        {artists.map((artist) => (
          <li key={artist.id}>
            <span>{artist.name}</span>
            <button onClick={handleRemoveArtist(artist.id)}>⛔️</button>
          </li>
        ))}
      </ul>
    </>
  )
}
