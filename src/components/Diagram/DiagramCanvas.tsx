import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { DiagramManagerProvider } from '../Context/DiagramManager'
import { IPortRefs, INodeRefs, ITransform } from '../../types'
import { IPortManager, PortManagerContextProvider } from '../Context/PortManager'

interface DiagramCanvasProps extends IPortManager {
  portRefs: IPortRefs
  nodeRefs: INodeRefs
  transform: ITransform
  children?: ReactNode
}

export const DiagramCanvas: React.FC<DiagramCanvasProps> = React.memo((props) => {
  const {
    children,
    portRefs,
    nodeRefs,
    transform,
    onDragNewSegment,
    onSegmentFail,
    onSegmentConnect,
    onShowSelectModel,
    onPortMount,
  } = props
  const { scale, translateX, translateY } = transform

  const [canvasDom, setBoundingBox] = useState<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  // 储存 canvas dom
  useEffect(() => {
    setBoundingBox(canvasRef.current)
  }, [])

  const contextValue = useMemo(
    () => ({
      canvasRef: canvasDom,
      portRefs,
      nodeRefs,
      scale,
    }),
    [canvasDom, portRefs, nodeRefs, scale]
  )
  const portContextValue = useMemo(
    () => ({
      onDragNewSegment,
      onSegmentFail,
      onSegmentConnect,
      onShowSelectModel,
      onPortMount,
    }),
    [onDragNewSegment, onSegmentFail, onSegmentConnect, onShowSelectModel, onPortMount]
  )

  return (
    <div
      id="diagram-canvas"
      className="diagram-canvas"
      ref={canvasRef}
      // style={{ transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})` }}
      style={{ transform: `matrix(${scale},0,0,${scale},${translateX},${translateY})` }}
    >
      <DiagramManagerProvider value={contextValue}>
        <PortManagerContextProvider value={portContextValue}>{children}</PortManagerContextProvider>
      </DiagramManagerProvider>
    </div>
  )
})

DiagramCanvas.displayName = 'DiagramCanvas'
