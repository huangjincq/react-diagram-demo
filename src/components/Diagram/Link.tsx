import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import makeSvgPath from '../../utils/makeSvgPath'
import getPathMidpoint from '../../utils/getPathMidpoint'
import { LinkDelete } from './LinkDelete'
import { ICoordinateType } from '../../types'
import { useDiagramManager } from '../Context/DiagramManager'

/**
 * Return the coordinates of a given entity (node or port)
 */
const getEntityCoordinates = (entity: any, portRefs: any, nodeRefs: any, canvas: any): ICoordinateType | undefined => {
  if (entity && entity.type === 'node' && nodeRefs[entity.id]) {
    const nodeEl = nodeRefs[entity.id]
    return [entity.coordinates[0], entity.coordinates[1] + nodeEl.offsetHeight / 2]
  }

  if (portRefs && portRefs[entity.id]) {
    const portDom = portRefs[entity.id]
    const parentNodeCoordinates = entity.coordinates

    return [
      parentNodeCoordinates[0] + portDom.offsetLeft + portDom.offsetWidth / 2,
      parentNodeCoordinates[1] + portDom.offsetTop + portDom.offsetHeight / 2
    ]
  }
  return undefined
}

interface LinkProps {
  input: any;
  output: any;
  link: any;
  onDelete: any
}

export const Link: React.FC<LinkProps> = React.memo((props) => {
  const {input, output, link, onDelete} = props
  const pathRef = useRef<any>(null)
  const [labelPosition, setLabelPosition] = useState<ICoordinateType>()
  const {canvasRef, portRefs, nodeRefs} = useDiagramManager()

  const inputPoint = useMemo(() => getEntityCoordinates(input, portRefs, nodeRefs, canvasRef), [input, portRefs, nodeRefs, canvasRef])

  const outputPoint = useMemo(() => getEntityCoordinates(output, portRefs, nodeRefs, canvasRef), [output, portRefs, nodeRefs, canvasRef])

  const path = useMemo(() => makeSvgPath(inputPoint, outputPoint), [inputPoint, outputPoint])

  useEffect(() => {
    if (inputPoint && outputPoint && pathRef.current) {
      const pos = getPathMidpoint(pathRef.current)
      setLabelPosition(pos as any)
    }
  }, [pathRef, link.label, inputPoint, outputPoint])

  // on link delete
  const onDoubleClick = useCallback(() => {
    onDelete(link)
  }, [onDelete, link])

  return (
    <g className={'diagram-link'}>
      <path d={path} className="bi-link-ghost" onDoubleClick={onDoubleClick}/>
      <path d={path} ref={pathRef} className="bi-link-path" onDoubleClick={onDoubleClick}/>
      {labelPosition && <LinkDelete position={labelPosition}/>}
    </g>
  )
})

