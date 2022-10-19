import { debounce } from '../utils/debounce'

const useResize = (fn) => {
  window.addEventListener('resize', debounce(fn, 500))
}

export default useResize
