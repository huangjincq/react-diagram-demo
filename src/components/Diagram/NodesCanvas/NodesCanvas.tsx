import React from 'react'
import { DiagramNode } from '../DiagramNode/DiagramNode'
import { ICoordinateType, INodeType } from '../../../types'
import { cloneDeep } from 'lodash-es'

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
  const handleNodePositionChange = (nodeId: string, nextCoordinates: ICoordinateType) => {
    const nextNodes = [...nodes]
    const index = nextNodes.findIndex(node => node.id === nodeId)
    nextNodes[index].coordinates = nextCoordinates
    onChange(nextNodes)
  }

  const handleNodeValueChange = (nodeId: string, nextNodeValue: any) => {
    // 需要deepClone  历史记录 需要独立的 data
    const nextNodes = cloneDeep(nodes)
    const index = nextNodes.findIndex(node => node.id === nodeId)
    nextNodes[index].data = nextNodeValue
    onChange(nextNodes)
  }

  const handleAddHistory = (nodeId: string, nextCoordinates: ICoordinateType) => {
    const nextNodes = cloneDeep(nodes)
    const index = nextNodes.findIndex(node => node.id === nodeId)
    nextNodes[index].coordinates = nextCoordinates
    onAddHistory(nextNodes)
  }


  return <>
    {nodes && nodes.length > 0 && nodes.map((node) => (
      <DiagramNode
        nodeInfo={node}
        scale={scale}
        onNodePositionChange={handleNodePositionChange}
        onNodeValueChange={handleNodeValueChange}
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

