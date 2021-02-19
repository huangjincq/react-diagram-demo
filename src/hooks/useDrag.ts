import { throttle } from 'lodash-es'
import { useRef, useCallback, useEffect } from 'react'
import { ICoordinateType } from '../types'

const DISABLED_DRAG_TAGS = ['INPUT', 'TEXTAREA']

interface DefaultOptions {
  ref: React.RefObject<any> | null
  throttleBy: number
}

interface InfoType {
  isDragging: boolean
  start: ICoordinateType
  end: ICoordinateType
  offset: ICoordinateType
}

const defaultOptions: DefaultOptions = {
  ref: null,
  throttleBy: 0
}

const getEventCoordinates = (event: MouseEvent): ICoordinateType => [event.clientX, event.clientY]

/**
 * Create a persistent callback reference that will live trough a component lifecycle
 * @param ref
 * @returns {Function}
 */
const CreateCallbackRef = (ref: any) =>
  useCallback(
    (callback) => {
      if (!ref.current || callback !== ref.current) {
        ref.current = callback
      }
    },
    [ref]
  )

const useDrag = (options = defaultOptions) => {
  const targetRef = options.ref // the target draggable element
  const dragStartHandlerRef = useRef<any>() // a ref to user's onDragStart handler
  const dragHandlerRef = useRef<any>() // a ref to user's onDrag handler
  const dragEndHandlerRef = useRef<any>() // a ref to user's onDragEnd handler
  // the dragging state is created from a useRef rather than a useState to avoid rendering during the dragging process
  const {current: info} = useRef<InfoType>({isDragging: false, start: [0, 0], end: [0, 0], offset: [0, 0]})

  /**
   * When the dragging starts, updates the state then perform the user's onDragStart handler if exists
   */
  const onDragStart = useCallback(
    (event) => {
      const targetTagName = event.target.tagName
      if (
        !info.isDragging &&
        targetRef?.current.contains(event.target) &&
        !DISABLED_DRAG_TAGS.includes(targetTagName)
      ) {
        info.isDragging = true
        info.end = [0, 0]
        info.offset = [0, 0]
        info.start = getEventCoordinates(event)

        if (dragStartHandlerRef.current) {
          dragStartHandlerRef.current(event, {...info})
        }
      }
    },
    [targetRef, info, dragStartHandlerRef]
  )

  /**
   * Whilst dragging the element, updates the state then perform the user's onDrag handler if exists
   */
  // eslint-disable-next-line
  const onDrag = useCallback(
    throttle((event) => {
      if (info.isDragging) {
        info.offset = [info.start[0] - event.clientX, info.start[1] - event.clientY]

        if (dragHandlerRef.current) {
          dragHandlerRef.current(event, {...info})
        }
      }
    }, options.throttleBy),
    [targetRef, info, dragHandlerRef]
    )

  /**
   * When the dragging ends, updates the state then perform the user's onDragEnd handler if exists
   */
  const onDragEnd = useCallback(
    (event) => {
      if (info.isDragging) {
        info.isDragging = false
        info.end = getEventCoordinates(event)

        if (dragEndHandlerRef.current) {
          dragEndHandlerRef.current(event, {...info})
        }
      }
    },
    [info, dragEndHandlerRef]
  )

  /**
   * When the layout renders the target item, assign the dragging events
   */
  useEffect(() => {
    const _onDragStart = (e: any) => onDragStart(e)
    const _onDrag = (e: any) => onDrag(e)
    const _onDragEnd = (e: any) => onDragEnd(e)

    if (targetRef?.current) {
      targetRef.current.addEventListener('mousedown', _onDragStart)
      document.addEventListener('mousemove', _onDrag)
      document.addEventListener('mouseup', _onDragEnd)
    }

    return () => {
      if (targetRef?.current) {
        // eslint-disable-next-line
        targetRef.current.removeEventListener('mousedown', _onDragStart)
        document.removeEventListener('mousemove', _onDrag)
        document.removeEventListener('mouseup', _onDragEnd)
      }
    }
  }, [targetRef, onDragStart, onDrag, onDragEnd])

  return {
    ref: targetRef,
    onDragStart: CreateCallbackRef(dragStartHandlerRef),
    onDrag: CreateCallbackRef(dragHandlerRef),
    onDragEnd: CreateCallbackRef(dragEndHandlerRef)
  }
}

export default useDrag
