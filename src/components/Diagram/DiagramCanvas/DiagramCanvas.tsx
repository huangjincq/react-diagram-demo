import React, { useEffect, useRef, useState } from 'react'
// import { useWindowScroll, useWindowResize } from 'beautiful-react-hooks';
import { isEqual } from 'lodash-es'
import DiagramContext from '../../Context/DiagramContext'
import { IPortRefs, INodeRefs } from "../../../types"

interface DiagramCanvasProps {
  portRefs: IPortRefs;
  nodeRefs: INodeRefs;
  scale: number
}

export const DiagramCanvas: React.FC<DiagramCanvasProps> = React.memo((props) => {
  const {children, portRefs, nodeRefs, scale} = props
  const [bbox, setBoundingBox] = useState<any>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  // calculate the given element bounding box and save it into the bbox state
  const calculateBBox = (el: HTMLDivElement | null) => {
    if (el) {
      const nextBBox: any = el.getBoundingClientRect()
      nextBBox.el = el
      if (!isEqual(nextBBox, bbox)) {
        setBoundingBox(nextBBox)
      }
    }
  }

  // when the canvas is ready and placed within the DOM, save its bounding box to be provided down
  // to children component as a context value for future calculations.
  useEffect(() => calculateBBox(canvasRef.current), [canvasRef.current])
  // same on window scroll and resize
  // useWindowScroll(() => calculateBBox(canvasRef.current));
  // useWindowResize(() => calculateBBox(canvasRef.current));

  return (
    <div id='diagram-canvas' className={'bi bi-diagram'} ref={canvasRef} style={{transform: `scale(${scale})`}}>
      <DiagramContext.Provider value={{canvas: bbox, ports: portRefs, nodes: nodeRefs}}>
        {children}
      </DiagramContext.Provider>
    </div>
  )
})

DiagramCanvas.displayName = 'DiagramCanvas'


