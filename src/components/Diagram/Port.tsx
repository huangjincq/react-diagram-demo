import React, { useEffect, useRef } from 'react'
import useDrag from '../../hooks/useDrag'
import { ICoordinateType, IPointType } from '../../types'
import { calculatingCoordinates, findEventTargetParentNodeId } from '../../utils'
import { useDiagramCanvas, useScale } from '../Context/DiagramManager'
import classnames from 'classnames'

interface PortProps extends IPointType {
  nodeId: string
  type: 'input' | 'output'
  index: number
  onDragNewSegment: (id: string, from: ICoordinateType, to: ICoordinateType) => void
  onSegmentFail: (id: string, type: string) => void
  onSegmentConnect: (id: string, targetPort: string) => void
  onShowSelectModel: (event: MouseEvent) => void
  onPortMount: (id: string, dom: HTMLElement) => void
}

export const Port: React.FC<PortProps> = React.memo((props) => {
  const {
    id,
    isLinked,
    index,
    nodeId,
    onDragNewSegment,
    onSegmentFail,
    onSegmentConnect,
    onShowSelectModel,
    onPortMount,
    type,
  } = props
  const canvasRef = useDiagramCanvas()
  const scale = useScale()
  const ref: any = useRef<React.RefObject<HTMLElement>>(null)
  const startCoordinatesRef = useRef<ICoordinateType | undefined>()

  const className = classnames('diagram-port', {
    'type-input': type === 'input',
    'type-output': type === 'output',
    'is-linked': isLinked,
  })

  const { onDragStart, onDrag, onDragEnd } = useDrag({ ref, throttleBy: 15 })

  onDragStart((event: MouseEvent) => {
    event.stopImmediatePropagation()
    event.stopPropagation()
    if (canvasRef && ref.current) {
      const { x: canvasX, y: canvasY } = canvasRef.getBoundingClientRect()
      const { x, y, width, height } = ref.current.getBoundingClientRect()
      startCoordinatesRef.current = [(x - canvasX + width / 2) / scale, (y - canvasY + height / 2) / scale]
    }
  })

  onDrag((event: MouseEvent) => {
    if (startCoordinatesRef.current) {
      event.stopImmediatePropagation()
      event.stopPropagation()
      const to: ICoordinateType = calculatingCoordinates(event, canvasRef, scale)

      onDragNewSegment(id, startCoordinatesRef.current, to)
    }
  })

  onDragEnd((event: MouseEvent) => {
    const targetDom = event.target as HTMLElement
    const targetIsPort = targetDom.classList.contains('diagram-port')
    // 如果目标元素是 port 区域 并且不是起点port
    if (targetIsPort && targetDom.id !== id) {
      onSegmentConnect(id, targetDom.id)
      return
    }

    // 如果目标元素是 node 区域 并非不是起点node
    const targetNode = findEventTargetParentNodeId(event.target as HTMLElement)
    if (targetNode && targetNode !== nodeId) {
      onSegmentConnect(id, targetNode)
      return
    }
    if (true) {
      onShowSelectModel(event)
      return
    }
    // 否则在空白区域松开 释放
    onSegmentFail && onSegmentFail(id, type)
  })

  useEffect(() => {
    onPortMount(id, ref.current)
  }, [id, onPortMount])

  return (
    <div className={className} id={id} ref={ref} style={{ top: index === 0 ? '45%' : `calc(45% + ${index * 18}px)` }} />
  )
})
