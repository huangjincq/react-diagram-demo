import React, { useCallback, useState, useRef } from 'react'
import { DiagramCanvas } from './DiagramCanvas'
import { NodesCanvas } from './NodesCanvas'
import { LinksCanvas } from './LinksCanvas'
import { Segment } from './Segment'

import './style.scss'
import { IDiagramType, ILinkType, ISegmentType, IPortRefs, INodeRefs, ITransform, ICoordinateType } from '../../types'
import { cloneDeep, isEqual } from 'lodash-es'
import useEventCallback from '../../hooks/useEventCallback'
import { findIndexById } from '../../utils'
import { copyNode } from '../NodeTypes/config'

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
    const index = findIndexById(nodeId, nextNodes)
    nextNodes[index] = { ...nextNodes[index], coordinates: nextCoordinates }

    onChange({ ...value, nodes: nextNodes }, true)
  })

  const handleNodeValueChange = useEventCallback((nodeId: string, nextNodeValue: any) => {
    const nextNodes = [...value.nodes]
    const index = findIndexById(nodeId, nextNodes)
    nextNodes[index] = { ...nextNodes[index], data: nextNodeValue }
    onChange({ ...value, nodes: nextNodes })
  })

  const handleAddHistory = useEventCallback((nodeId: string, nextCoordinates: ICoordinateType) => {
    const nextNodes = [...value.nodes]
    const index = findIndexById(nodeId, nextNodes)
    nextNodes[index] = { ...nextNodes[index], coordinates: nextCoordinates }

    onAddHistory({ ...value, nodes: nextNodes })
  })

  const handleNodeCopy = useEventCallback((nodeId: string) => {
    const index = findIndexById(nodeId, value.nodes)
    const newNode = copyNode(value.nodes[index])
    onChange({ ...value, nodes: [...value.nodes, newNode] })
  })

  const handleNodeDelete = useEventCallback((nodeId: string) => {
    const nextNodes = [...value.nodes]
    const index = findIndexById(nodeId, nextNodes)
    const currentNode = value.nodes[index]
    const nodeOutputs = currentNode.outputs.map((port) => port.id)
    const nodeInputs = currentNode.inputs.map((port) => port.id)
    nextNodes.splice(index, 1)
    // 删除和节点相关的所有线
    let nextLinks = value.links.filter((link) => {
      return (
        !nodeInputs.includes(link.output) &&
        !nodeOutputs.includes(link.input) &&
        link.input !== nodeId &&
        link.output !== nodeId
      )
    })
    onChange({ ...value, links: nextLinks, nodes: nextNodes })
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
        onNodeDelete={handleNodeDelete}
        onNodeCopy={handleNodeCopy}
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
