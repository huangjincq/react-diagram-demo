import React from 'react'
import { DiagramNode } from './DiagramNode'
import { ICoordinateType, INodeType } from '../../types'
import { cloneDeep } from 'lodash-es'

interface NodesCanvasProps {
  nodes: INodeType[]
  onNodeMount: any
  onPortRegister: any
  onNodeRemove: any
  onDragNewSegment: any
  onSegmentFail: any
  onSegmentConnect: any
  activeNodeIds: string[]
  onNodePositionChange: (id: string, nextCoords: ICoordinateType) => void
  onNodeValueChange: (id: string, nextNodeValue: any) => void
  onAddHistory: (id: string, nextCoords: ICoordinateType) => void
}

export const NodesCanvas: React.FC<NodesCanvasProps> = React.memo((props) => {
  const { nodes } = props

  return (
    <>
      {nodes.map((node) => (
        <DiagramNode nodeInfo={node} key={node.id} {...props} />
      ))}
    </>
  )
})

NodesCanvas.displayName = 'NodesCanvas'
