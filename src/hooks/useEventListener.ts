import { useEffect, useRef } from 'react'

function useEventListener(eventName: string, handler: (event?: any) => void, element = document, options?: any) {
  // 创建一个储存处理方法的ref
  const savedHandler = useRef<any>()

  // 当处理函数改变的时候更新ref.current的方法
  // 这样可以使我们的总是获取到最新的处理函数
  // 并且不需要在它的effect依赖数组中传递
  // 并且避免有可能每次渲染重新引起effect方法
  useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(
    () => {
      // 确认是否支持addEventListener
      const isSupported = element && element.addEventListener
      if (!isSupported) return

      // 创建一个调用储存在ref中函数的事件监听
      const eventListener = (event: any) => savedHandler.current(event)

      // 添加事件监听
      element.addEventListener(eventName, eventListener, options)

      // 在cleanup的回调中，清除事件监听
      return () => {
        element.removeEventListener(eventName, eventListener)
      }
    },
    [eventName, element, options] // 当元素或者绑定事件改变时，重新运行
  )
}
export default useEventListener
