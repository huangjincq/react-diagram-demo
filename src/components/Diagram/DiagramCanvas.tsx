import React, { useEffect, useRef, useState } from 'react'
import { DiagramManagerProvider } from '../Context/DiagramManager'
import { IPortRefs, INodeRefs, ITransform } from '../../types'

interface DiagramCanvasProps {
  portRefs: IPortRefs
  nodeRefs: INodeRefs
  transform: ITransform
}

export const DiagramCanvas: React.FC<DiagramCanvasProps> = React.memo((props) => {
  const { children, portRefs, nodeRefs, transform } = props
  const { scale, translateX, translateY } = transform

  const [canvasDom, setBoundingBox] = useState<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  // 储存 canvas dom
  useEffect(() => {
    setBoundingBox(canvasRef.current)
  }, [])

  return (
    <div
      id="diagram-canvas"
      className="diagram-canvas"
      ref={canvasRef}
      // style={{ transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})` }}
      style={{ transform: `matrix(${scale},0,0,${scale},${translateX},${translateY})` }}
    >
      <DiagramManagerProvider value={{ canvasRef: canvasDom, portRefs, nodeRefs, scale }}>
        {children}
      </DiagramManagerProvider>
    </div>
  )
})

DiagramCanvas.displayName = 'DiagramCanvas'
