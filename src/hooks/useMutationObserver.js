import { useEffect } from 'react'

function useMutationObserver(
  ref,
  callback,
  options,
) {
  useEffect(() => {
    if (ref.current) {
      const observer = new MutationObserver(callback)
      observer.observe(ref.current, options)
      return () => {
        observer.disconnect()
      }
    }
    return null
  }, [callback, options, ref])
}

export { useMutationObserver }
