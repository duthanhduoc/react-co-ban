import useLayoutContext from './useLayoutContext'

export default function Container({ children }: { children: React.ReactNode }) {
  const { count } = useLayoutContext()
  return (
    <div className='container'>
      <div>Container: {count}</div>
      <div>{children}</div>
    </div>
  )
}
