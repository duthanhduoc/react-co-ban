import useLayoutContext from './useLayoutContext'
export default function Header() {
  const context = useLayoutContext()
  const { count } = context
  return (
    <div className='header'>
      <div>Header</div>
      <div>{count}</div>
    </div>
  )
}
