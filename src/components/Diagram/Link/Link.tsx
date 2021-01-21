import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import usePortRefs from '../../shared/internal_hooks/usePortRefs'
import useCanvas from '../../shared/internal_hooks/useCanvas'
import makeSvgPath from '../../shared/functions/makeSvgPath'
import getPathMidpoint from '../../shared/functions/getPathMidpoint'
import useNodeRefs from '../../shared/internal_hooks/useNodeRefs'
import {LinkDelete} from './LinkDelete'
import {ICoordinateType} from "../../../types";

// local hook, returns portRefs & nodeRefs
const useContextRefs = () => {
  const canvas = useCanvas()
  const portRefs = usePortRefs()
  const nodeRefs = useNodeRefs()

  return {canvas, nodeRefs, portRefs}
}

/**
 * Return the coordinates of a given entity (node or port)
 */
const getEntityCoordinates = (entity: any, portRefs: any, nodeRefs: any, canvas: any): ICoordinateType | undefined => {
  if (entity && entity.type === 'node' && nodeRefs[entity.entity.id]) {
    const nodeEl = nodeRefs[entity.entity.id]
    const bbox = nodeEl
    return [entity.entity.coordinates[0] + bbox.width / 2, entity.entity.coordinates[1] + bbox.height / 2]
  }

  if (portRefs && portRefs[entity.entity.id]) {
    const portDom = portRefs[entity.entity.id]
    const parentNodeCoordinates = entity.parentNodeInfo.coordinates

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
  const {canvas, portRefs, nodeRefs} = useContextRefs()

  const inputPoint = useMemo(() => getEntityCoordinates(input, portRefs, nodeRefs, canvas), [input, portRefs, nodeRefs, canvas])

  const outputPoint = useMemo(() => getEntityCoordinates(output, portRefs, nodeRefs, canvas), [output, portRefs, nodeRefs, canvas])

  const path = useMemo(() => makeSvgPath(inputPoint, outputPoint), [inputPoint, outputPoint])

  useEffect(() => {
    if (inputPoint && outputPoint && pathRef.current) {
      const pos = getPathMidpoint(pathRef.current)
      setLabelPosition(pos as any)
    }
  }, [pathRef.current, link.label, inputPoint, outputPoint])

  // on link delete
  const onDoubleClick = useCallback(() => {
    onDelete(link)
  }, [onDelete, link])

  return (
    <g className={'bi-diagram-link'}>
      {!link.readonly && <path d={path} className="bi-link-ghost" onDoubleClick={onDoubleClick}/>}
      <path d={path} ref={pathRef} className="bi-link-path" onDoubleClick={onDoubleClick}/>
      {labelPosition && <LinkDelete position={labelPosition}/>}
    </g>
  )
})

