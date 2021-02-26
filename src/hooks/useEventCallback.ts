import { useLayoutEffect, useMemo, useRef } from 'react'

type Fn<ARGS extends any[], R> = (...args: ARGS) => R
const useEventCallback = <A extends any[], R>(fn: Fn<A, R>): Fn<A, R> => {
  let ref = useRef(fn)
  useLayoutEffect(() => {
    ref.current = fn
  })
  return useMemo(
    () => (...args) => {
      const { current } = ref
      return current(...args)
    },
    []
  )
}
export default useEventCallback
