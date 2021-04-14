import { useEffect } from 'react'
import eventBus from '../utils/eventBus'

interface UseEventType {
  type: string
  onChange: any
}
const useEventBus = ({ type, onChange }: UseEventType, dep = []) => {
  useEffect(() => {
    eventBus.on(type, onChange)
    return () => {
      eventBus.off(type, onChange)
    }
  }, [type, onChange, dep])
}
export default useEventBus
