import React, { useEffect, useRef } from 'react'
import useDrag from '../../hooks/useDrag'
import { ICoordinateType } from '../../types'
import { calculatingCoordinates, findEventTargetParentNodeId } from '../../utils'
import { useDiagramCanvas, useScale } from '../Context/DiagramManager'
import classnames from 'classnames'

interface PortProps {
  id: string;
  nodeId: string;
  type: 'input' | 'output';
  onDragNewSegment: (id: string, from: ICoordinateType, to: ICoordinateType) => void;
  onSegmentFail: (id: string, type: string) => void;
  onSegmentConnect: (id: string, targetPort: string) => void;
  onMount: (id: string, dom: HTMLElement) => void;
}

export const Port: React.FC<PortProps> = React.memo((props) => {
  const {id, nodeId, onDragNewSegment, onSegmentFail, onSegmentConnect, onMount, type} = props
  const canvasRef = useDiagramCanvas()
  const scale = useScale()
  const ref: any = useRef<React.RefObject<HTMLElement>>(null)
  const startCoordinatesRef = useRef<ICoordinateType | undefined>()

  const className = classnames('diagram-port', {
    'type-input': type === 'input',
    'type-output': type === 'output'
  })

  const {onDragStart, onDrag, onDragEnd} = useDrag({ref, throttleBy: 15})

  onDragStart((event: MouseEvent) => {
    event.stopImmediatePropagation()
    event.stopPropagation()
    if (canvasRef && ref.current) {
      const {x: canvasX, y: canvasY} = canvasRef.getBoundingClientRect()
      const {x, y, width, height} = ref.current.getBoundingClientRect()
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
    // 否则在空白区域松开 释放
    onSegmentFail && onSegmentFail(id, type)
  })

  useEffect(() => {
    onMount(id, ref.current)
  }, [id, onMount])

  return <div className={className} id={id} ref={ref}/>
})
