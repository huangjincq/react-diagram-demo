import React, { useEffect, useRef } from 'react'
import useDrag from '../../hooks/useDrag'
import useNodeUnregistration from '../../hooks/useNodeUnregistration'
import { INodeType, ICoordinateType } from '../../types'
import { nodesConfig } from '../NodeTypes/config'
import { isEqual } from 'lodash-es'
import { useScale } from '../Context/DiagramManager'
import { DiagramNodePorts } from './DiagramNodePorts'

interface DiagramNodeProps {
  nodeInfo: INodeType
  onNodePositionChange: (id: string, nextCoords: ICoordinateType) => void
  onNodeValueChange: (id: string, nextNodeValue: any) => void
  onAddHistory: (id: string, nextCoords: ICoordinateType) => void
  onMount: any
  onPortRegister: any
  onNodeRemove: any
  onDragNewSegment: any
  onSegmentFail: any
  onSegmentConnect: any
}

export const DiagramNode: React.FC<DiagramNodeProps> = React.memo((props) => {
  const {
    nodeInfo,
    onNodeValueChange,
    onNodePositionChange,
    onPortRegister,
    onNodeRemove,
    onDragNewSegment,
    onMount,
    onSegmentFail,
    onSegmentConnect,
    onAddHistory,
  } = props

  const { id, coordinates, type, inputs, data, outputs } = nodeInfo

  const scale = useScale()

  // nodeType
  const component = nodesConfig[type]?.component

  const handleNodeDataChange = (nextNodeData: any) => {
    onNodeValueChange(id, nextNodeData)
  }

  // 传给子组件点 Props
  const nodeItemProps = {
    value: data,
    onChange: handleNodeDataChange,
  }

  const ref: any = useRef(null)

  const { onDragStart, onDrag, onDragEnd } = useDrag({ throttleBy: 14, ref }) // get the drag n drop methods
  const dragStartPoint = useRef(coordinates) // keeps the drag start point in a persistent reference

  // when drag starts, save the starting coordinates into the `dragStartPoint` ref
  onDragStart(() => {
    dragStartPoint.current = coordinates
  })

  // whilst dragging calculates the next coordinates and perform the `onNodePositionChange` callback
  onDrag((event: MouseEvent, info: any) => {
    event.stopImmediatePropagation()
    event.stopPropagation()
    const nextCoords: ICoordinateType = [
      dragStartPoint.current[0] - info.offset[0] / scale,
      dragStartPoint.current[1] - info.offset[1] / scale,
    ]
    onNodePositionChange(id, nextCoords)
  })

  onDragEnd((event: MouseEvent, info: any) => {
    if (!isEqual(dragStartPoint.current, coordinates)) {
      onAddHistory(id, dragStartPoint.current)
    }
  })

  // on component unmount, remove its references
  useNodeUnregistration(onNodeRemove, inputs, outputs, id)

  const options = { nodeId: id, registerPort: onPortRegister, onDragNewSegment, onSegmentFail, onSegmentConnect }

  useEffect(() => {
    onMount(id, ref.current)
  }, [id, onMount])

  return (
    <div
      id={id}
      className={'diagram-node bi-diagram-node-default'}
      ref={ref}
      style={{ left: coordinates[0], top: coordinates[1] }}
    >
      {component && React.createElement(component, nodeItemProps)}
      <DiagramNodePorts inputs={inputs} {...options} type="input" />
      <DiagramNodePorts inputs={outputs} {...options} type="output" />
    </div>
  )
})

DiagramNode.displayName = 'DiagramNode'
