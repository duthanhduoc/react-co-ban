import { useContext } from 'react'
import LayoutContext from './LayoutContext'

// Custom Hook
const useLayoutContext = () => {
  return useContext(LayoutContext)
}

export default useLayoutContext
