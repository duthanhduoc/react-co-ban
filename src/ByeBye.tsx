export default function ByeBye({
  title1,
  title2,
  title3 = 'Xin Chao',
}: {
  title1: string
  title2: string
  title3?: string
}) {
  return (
    <div>
      <h1 style={{ color: 'red' }}>Bye Bye Component</h1>
      <h1>{title1}</h1>
      <h2>{title2}</h2>
      <h3>{title3}</h3>
    </div>
  )
}
