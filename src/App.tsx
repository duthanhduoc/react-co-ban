import { Fragment } from 'react/jsx-runtime'

const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.',
  ],
}

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, index) => (
        <Fragment key={index}>
          {index > 0 && <hr />}
          <p>{line}</p>
        </Fragment>
      ))}
    </article>
  )
}
