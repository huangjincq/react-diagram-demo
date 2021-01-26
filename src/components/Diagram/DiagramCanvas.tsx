import React, { useEffect, useRef, useState } from 'react'
import DiagramContext from '../Context/DiagramContext'
import { IPortRefs, INodeRefs } from '../../types'

interface DiagramCanvasProps {
  portRefs: IPortRefs;
  nodeRefs: INodeRefs;
  scale: number
}

export const DiagramCanvas: React.FC<DiagramCanvasProps> = React.memo((props) => {
  const {children, portRefs, nodeRefs, scale} = props
  const [canvasDom, setBoundingBox] = useState<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  // 储存 canvas dom
  useEffect(() => {
    setBoundingBox(canvasRef.current)
  }, [])


  return (
    <div id='diagram-canvas' className={'bi bi-diagram'} ref={canvasRef} style={{transform: `scale(${scale})`}}>
      <DiagramContext.Provider value={{canvas: canvasDom, ports: portRefs, nodes: nodeRefs, scale}}>
        {children}
      </DiagramContext.Provider>
    </div>
  )
})

DiagramCanvas.displayName = 'DiagramCanvas'


