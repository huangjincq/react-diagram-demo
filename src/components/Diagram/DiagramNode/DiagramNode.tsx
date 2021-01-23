import React, { useRef } from 'react'
import { usePortRegistration, useNodeRegistration } from '../../shared/internal_hooks/useContextRegistration'
import portGenerator from './portGenerator'
import useDrag from '../../shared/internal_hooks/useDrag'
import useNodeUnregistration from '../../shared/internal_hooks/useNodeUnregistration'
import { INodeType, ICoordinateType } from '../../../types'
import { nodesConfig } from '../../NodeTypes/helper'

interface DiagramNodeProps {
  nodeInfo: INodeType;
  onPositionChange: (id: string, nextCoords: ICoordinateType) => void;
  onAddHistory: (id: string, nextCoords: ICoordinateType) => void;
  onMount: any;
  onPortRegister: any;
  onNodeRemove: any;
  onDragNewSegment: any;
  onSegmentFail: any;
  onSegmentConnect: any;
  scale: number;
}

export const DiagramNode: React.FC<DiagramNodeProps> = React.memo((props) => {
  const {
    nodeInfo,
    onPositionChange,
    onPortRegister,
    onNodeRemove,
    onDragNewSegment,
    onMount,
    onSegmentFail,
    onSegmentConnect,
    scale, onAddHistory
  } = props

  const {
    id,
    coordinates,
    type,
    inputs,
    outputs
  } = nodeInfo

  // nodeType
  const component = nodesConfig[type]?.component

  const ref: any = useRef(null)
  const registerPort = usePortRegistration(inputs, outputs, onPortRegister) // get the port registration method

  const {onDragStart, onDrag, onDragEnd} = useDrag({throttleBy: 14, ref}) // get the drag n drop methods
  const dragStartPoint = useRef(coordinates) // keeps the drag start point in a persistent reference

  // when drag starts, save the starting coordinates into the `dragStartPoint` ref
  onDragStart(() => {
    dragStartPoint.current = coordinates
  })

  // whilst dragging calculates the next coordinates and perform the `onPositionChange` callback
  onDrag((event: MouseEvent, info: any) => {
    event.stopImmediatePropagation()
    event.stopPropagation()
    const nextCoords: ICoordinateType = [dragStartPoint.current[0] - info.offset[0] / scale, dragStartPoint.current[1] - info.offset[1] / scale]
    onPositionChange(id, nextCoords)
  })

  onDragEnd((event: MouseEvent, info: any) => {
    onAddHistory(id, dragStartPoint.current)
  })

  // on component unmount, remove its references
  useNodeUnregistration(onNodeRemove, inputs, outputs, id)

  // perform the onMount callback when the node is allowed to register
  useNodeRegistration(ref, onMount, id)


  const options = {registerPort, onDragNewSegment, onSegmentFail, onSegmentConnect, scale}
  const InputPorts = inputs?.map(portGenerator(options, 'input')) || []
  const OutputPorts = outputs?.map(portGenerator(options, 'output')) || []

  return (
    <div className={'bi bi-diagram-node bi-diagram-node-default'} ref={ref}
         style={{left: coordinates[0], top: coordinates[1]}}>
      {component && React.createElement(component, {})}
      <div className="bi-port-wrapper">
        <div className="bi-input-ports">{InputPorts}</div>
        <div className="bi-output-ports">{OutputPorts}</div>
      </div>
    </div>
  )
})

DiagramNode.displayName = 'DiagramNode'
