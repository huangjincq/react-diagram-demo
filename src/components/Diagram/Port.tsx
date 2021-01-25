import React, { useEffect, useRef } from 'react'
import useDrag from '../../hooks/useDrag'
import useCanvas from '../../hooks/useCanvas'
import { ICoordinateType } from '../../types'

interface PortProps {
  id: string;
  type: string;
  scale: number;
  onDragNewSegment: (id: string, from: ICoordinateType, to: ICoordinateType) => void;
  onSegmentFail: (id: string, type: string) => void;
  onSegmentConnect: (id: string, targetPort: string) => void,
  onMount: (id: string, dom: HTMLElement) => void,
}

export const Port: React.FC<PortProps> = React.memo((props) => {
  const {
    id,
    onDragNewSegment,
    onSegmentFail,
    onSegmentConnect,
    onMount,
    type,
    scale,
    ...rest
  } = props
  const canvas = useCanvas()
  const ref: any = useRef<React.RefObject<HTMLElement>>(null)

  const {onDragStart, onDrag, onDragEnd} = useDrag({ref, throttleBy: 15})

  onDragStart((event:MouseEvent) => {
    event.stopImmediatePropagation()
    event.stopPropagation()
  })

  onDrag((event: MouseEvent, info: any) => {
    if (onDragNewSegment) {
      event.stopImmediatePropagation()
      event.stopPropagation()
      const canvasScaleRect = (canvas as any).el.getBoundingClientRect()
      const from: ICoordinateType = [(info.start[0] - canvasScaleRect.x) / scale, (info.start[1] - canvasScaleRect.y) / scale]
      const to: ICoordinateType = [(event.clientX - canvasScaleRect.x) / scale, (event.clientY - canvasScaleRect.y) / scale]

      onDragNewSegment(id, from, to)
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

  return <div className="bi bi-diagram-port" data-port-id={id} ref={ref} {...rest} />
})
