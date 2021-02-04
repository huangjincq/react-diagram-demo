import React, { useEffect, useRef } from 'react'
import useDrag from '../../hooks/useDrag'
import { ICoordinateType } from '../../types'
import { calculatingCoordinates } from '../../utils'
import { useDiagramCanvas, useScale } from '../Context/DiagramManager'
import classnames from 'classnames'

interface PortProps {
  id: string;
  type: 'input' | 'output';
  onDragNewSegment: (id: string, from: ICoordinateType, to: ICoordinateType) => void;
  onSegmentFail: (id: string, type: string) => void;
  onSegmentConnect: (id: string, targetPort: string) => void;
  onMount: (id: string, dom: HTMLElement) => void;
}

export const Port: React.FC<PortProps> = React.memo((props) => {
  const {id, onDragNewSegment, onSegmentFail, onSegmentConnect, onMount, type} = props
  const canvasRef = useDiagramCanvas()
  const scale = useScale()
  const ref: any = useRef<React.RefObject<HTMLElement>>(null)
  const startCoordinatesRef = useRef<ICoordinateType | undefined>()

  const className = classnames('diagram-port', {
    'type-input': type === 'input',
    'type-output': type === 'output',
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
    const targetPort = (event.target as any)?.getAttribute('data-port-id')

    if (targetPort && event.target !== ref.current) {
      onSegmentConnect(id, targetPort)
      return
    }
    onSegmentFail && onSegmentFail(id, type)
  })

  useEffect(() => {
    onMount(id, ref.current)
  }, [id, onMount])

  return <div className={className} data-port-id={id} ref={ref}/>
})
