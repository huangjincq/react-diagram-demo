import React from 'react'
import { DiagramNode } from '../DiagramNode/DiagramNode'
import updateNodeCoordinates from './updateNodeCoordinates'
import { ICoordinateType, INodeType } from "../../../types"

interface NodesCanvasProps {
  nodes: INodeType[];
  onChange: any;
  onNodeRegister: any;
  onPortRegister: any;
  onNodeRemove: any;
  onDragNewSegment: any;
  onSegmentFail: any;
  onSegmentConnect: any;
  scale: number;
  onAddHistory: any;
}

export const NodesCanvas: React.FC<NodesCanvasProps> = React.memo((props) => {
  const {
    nodes,
    onPortRegister,
    onNodeRegister,
    onNodeRemove,
    onDragNewSegment,
    onSegmentFail,
    onSegmentConnect,
    onChange,
    scale,
    onAddHistory
  } = props

  // when a node item update its position updates it within the nodes array
  const onNodePositionChange = (nodeId: string, newCoordinates: ICoordinateType) => {
    if (onChange) {
      const nextNodes = updateNodeCoordinates(nodeId, newCoordinates, nodes)
      onChange(nextNodes)
    }
  }

  const handleAddHistory = (nodeId: string, newCoordinates: ICoordinateType) => {
    if (onAddHistory) {
      const nextNodes = updateNodeCoordinates(nodeId, newCoordinates, nodes)
      onAddHistory(nextNodes)
    }
  }


  return <>
    {nodes && nodes.length > 0 && nodes.map((node) => (
      <DiagramNode
        nodeInfo={node}
        scale={scale}
        onPositionChange={onNodePositionChange}
        onPortRegister={onPortRegister}
        onNodeRemove={onNodeRemove}
        onDragNewSegment={onDragNewSegment}
        onSegmentFail={onSegmentFail}
        onSegmentConnect={onSegmentConnect}
        onMount={onNodeRegister}
        onAddHistory={handleAddHistory}
        key={node.id}
      />
    ))}
  </>
})

NodesCanvas.displayName = 'NodesCanvas'

