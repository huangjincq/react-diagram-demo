import React, { useEffect, useRef } from 'react'
import useDrag from '../../hooks/useDrag'
import { ICoordinateType, IPointType } from '../../types'
import { calculatingCoordinates, findEventTargetParentNodeId } from '../../utils'
import { useDiagramManager } from '../Context/DiagramManager'
import classnames from 'classnames'
import { usePortManager } from '../Context/PortManager'

interface PortProps extends IPointType {
  nodeId: string
}

export const Port: React.FC<PortProps> = React.memo((props) => {
  const { id, isLinked, nodeId } = props
  const { scale, canvasRef } = useDiagramManager()
  const { onDragNewSegment, onSegmentFail, onSegmentConnect, onShowSelectModel, onPortMount } = usePortManager()
  const ref: any = useRef<React.RefObject<HTMLElement>>(null)
  const startCoordinatesRef = useRef<ICoordinateType | undefined>()

  const className = classnames('diagram-port', {
    'is-linked': isLinked,
  })

  const { onDragStart, onDrag, onDragEnd } = useDrag({ ref, throttleBy: 16 })

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
    const panelDom = document.getElementById('diagram-panel')
    if (panelDom && panelDom.contains(event.target as HTMLElement)) {
      onShowSelectModel(event, id)
    }
    // 否则在空白区域松开 释放
    onSegmentFail && onSegmentFail(id)
  })

  useEffect(() => {
    onPortMount(id, ref.current)
  }, [id, onPortMount])

  return <b className={className} id={id} ref={ref} />
})
