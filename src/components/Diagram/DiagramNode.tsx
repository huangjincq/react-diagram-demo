import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import useDrag from '../../hooks/useDrag'
import { INodeType, ICoordinateType } from '../../types'
import { nodesConfig } from '../NodeTypes/config'
import { isEqual } from 'lodash-es'
import { useScale } from '../Context/DiagramManager'
import { DiagramNodePorts } from './DiagramNodePorts'
import classnames from 'classnames'
import { DiagramNodeActionButtons } from './DiagramNodeActionButtons'
import eventBus, { EVENT_NODE_MOVE_END, EVENT_NODE_MOVING } from '../../utils/eventBus'

interface DiagramNodeProps {
  nodeInfo: INodeType
  onNodePositionChange: (id: string, nextCoords: ICoordinateType) => void
  onNodeValueChange: (id: string, nextNodeValue: any) => void
  onAddHistory: (id: string, nextCoords: ICoordinateType) => void
  onNodeMount: (id: string, dom: HTMLDivElement) => void
  onNodeDelete: (nodeId: string) => void
  onNodeCopy: (nodeId: string) => void
  onToggleActiveNodeId: (nodeId: string) => void
  isActive: boolean
}

export const DiagramNode: React.FC<DiagramNodeProps> = React.memo((props) => {
  const {
    nodeInfo,
    onNodeValueChange,
    onNodePositionChange,
    onNodeMount,
    onAddHistory,
    onToggleActiveNodeId,
    isActive,
    onNodeDelete,
    onNodeCopy,
  } = props

  const { id, coordinates, type, inputs, data, outputs } = nodeInfo

  const scale = useScale()

  // nodeType
  const nodeConfig = nodesConfig[type]

  const handleNodeDataChange = (nextNodeData: any) => {
    onNodeValueChange(id, nextNodeData)
  }

  // 传给子组件点 Props
  const nodeItemProps = {
    value: data,
    onChange: handleNodeDataChange,
    nodeId: id,
    inputs: nodeConfig?.customRenderPort ? inputs : undefined,
    outputs: nodeConfig?.customRenderPort ? outputs : undefined,
  }

  const ref: any = useRef(null)

  const { onDragStart, onDrag, onDragEnd } = useDrag({ throttleBy: 16, ref }) // get the drag n drop methods
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
      dragStartPoint.current[0] + info.offset[0] / scale,
      dragStartPoint.current[1] + info.offset[1] / scale,
    ]

    onNodePositionChange(id, nextCoords)
    eventBus.emit(EVENT_NODE_MOVING, id, nextCoords)
  })

  onDragEnd((event: MouseEvent) => {
    if (!isEqual(dragStartPoint.current, coordinates)) {
      onAddHistory(id, dragStartPoint.current)
    }
    eventBus.emit(EVENT_NODE_MOVE_END)
  })

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (event.shiftKey) {
        onToggleActiveNodeId(id)
      }
    },
    [id, onToggleActiveNodeId]
  )

  useEffect(() => {
    onNodeMount(id, ref.current)
  }, [id, onNodeMount])

  const className = useMemo(() => {
    return classnames('diagram-node', {
      active: isActive,
    })
  }, [isActive])

  if (!nodeConfig.component) {
    console.warn(`NodeType "${type}" does not exist`)

    return null
  }

  return (
    <div
      id={id}
      className={className}
      ref={ref}
      style={{ left: coordinates[0], top: coordinates[1] }}
      onClick={handleClick}
    >
      {nodeConfig.component && React.createElement(nodeConfig.component, nodeItemProps)}
      {!nodeConfig.customRenderPort && (
        <>
          <DiagramNodePorts ports={inputs} nodeId={id} type="input" />
          <DiagramNodePorts ports={outputs} nodeId={id} type="output" />
        </>
      )}
      <DiagramNodeActionButtons id={id} onNodeDelete={onNodeDelete} onNodeCopy={onNodeCopy} />
    </div>
  )
})

DiagramNode.displayName = 'DiagramNode'
