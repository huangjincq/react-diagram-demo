import React, { useCallback, useState, useRef } from 'react'
import { DiagramCanvas } from './DiagramCanvas'
import { NodesCanvas } from './NodesCanvas'
import { LinksCanvas } from './LinksCanvas'
import { Segment } from './Segment'

import './style.scss'
import { IDiagramType, ILinkType, ISegmentType, IPortRefs, INodeRefs, ITransform, ICoordinateType } from '../../types'
import { cloneDeep, isEqual } from 'lodash-es'
import useEventCallback from '../../hooks/useEventCallback'

interface DiagramProps {
  value: IDiagramType
  onChange: (value: IDiagramType, notAddHistory?: boolean) => void
  onAddHistory: (value: IDiagramType) => void
  transform: ITransform
  activeNodeIds: string[]
}

export const Diagram: React.FC<DiagramProps> = React.memo((props) => {
  const { value, onChange, onAddHistory, transform, activeNodeIds } = props
  const [segment, setSegment] = useState<ISegmentType | undefined>()
  const { current: portRefs } = useRef<IPortRefs>({}) // 保存所有 Port 的 Dom 节点
  const { current: nodeRefs } = useRef<INodeRefs>({}) // 保存所有 Node 的 Dom 节点

  const handleNodePositionChange = useEventCallback((nodeId: string, nextCoordinates: ICoordinateType) => {
    const nextNodes = [...value.nodes]

    const index = nextNodes.findIndex((node) => node.id === nodeId)
    nextNodes[index] = { ...nextNodes[index], coordinates: nextCoordinates }

    onChange({ ...value, nodes: nextNodes }, true)
  })

  const handleNodeValueChange = useEventCallback((nodeId: string, nextNodeValue: any) => {
    const nextNodes = [...value.nodes]
    const index = nextNodes.findIndex((node) => node.id === nodeId)
    nextNodes[index] = { ...nextNodes[index], data: nextNodeValue }
    onChange({ ...value, nodes: nextNodes })
  })

  const handleAddHistory = useEventCallback((nodeId: string, nextCoordinates: ICoordinateType) => {
    const nextNodes = [...value.nodes]
    const index = nextNodes.findIndex((node) => node.id === nodeId)
    nextNodes[index] = { ...nextNodes[index], coordinates: nextCoordinates }

    onAddHistory({ ...value, nodes: nextNodes })
  })

  // when a port is registered, save it to the local reference
  const onPortRegister = useEventCallback((portId: string, portEl: HTMLElement) => {
    portRefs[portId] = portEl
  })

  // when a node is registered, save it to the local reference
  const onNodeRegister = useEventCallback((nodeId: string, nodeEl: HTMLDivElement) => {
    // const rect = nodeEl.getBoundingClientRect()
    nodeRefs[nodeId] = nodeEl
  })

  // when a new segment is dragged, save it to the local state
  const onDragNewSegment = useCallback((portId, from, to) => {
    setSegment({ id: `segment-${portId}`, from, to })
  }, [])

  // when a segment fails to connect, reset the segment state
  const onSegmentFail = useCallback(() => {
    setSegment(undefined)
  }, [])

  // when a segment connects, update the links schema, perform the onChange callback
  // with the new data, then reset the segment state
  const onSegmentConnect = useEventCallback((input: string, output: string) => {
    const nextLinks = [...value.links, { input, output }]
    onChange({ ...value, links: nextLinks })
    setSegment(undefined)
  })

  // when links change, performs the onChange callback with the new incoming data
  const onLinkDelete = useEventCallback((link: ILinkType) => {
    const nextLinks = value.links.filter((item) => !isEqual(item, link))
    onChange({ ...value, links: nextLinks })
  })

  return (
    <DiagramCanvas portRefs={portRefs} nodeRefs={nodeRefs} transform={transform}>
      <NodesCanvas
        nodes={value.nodes}
        onNodeMount={onNodeRegister}
        onPortMount={onPortRegister}
        onDragNewSegment={onDragNewSegment}
        onSegmentFail={onSegmentFail}
        onNodePositionChange={handleNodePositionChange}
        onNodeValueChange={handleNodeValueChange}
        onSegmentConnect={onSegmentConnect}
        onAddHistory={handleAddHistory}
        activeNodeIds={activeNodeIds}
      />
      {value.links.length > 0 && <LinksCanvas nodes={value.nodes} links={value.links} onDelete={onLinkDelete} />}
      {segment && <Segment segment={segment} />}
    </DiagramCanvas>
  )
})

Diagram.displayName = 'Diagram'
