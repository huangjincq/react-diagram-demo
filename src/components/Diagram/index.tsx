import React, { useCallback, useState, useRef } from 'react'
import { DiagramCanvas } from './DiagramCanvas'
import { NodesCanvas } from './NodesCanvas'
import { LinksCanvas } from './LinksCanvas'
import { Segment } from './Segment'
import './style.scss'
import {
  IDiagramType,
  ILinkType,
  ISegmentType,
  IPortRefs,
  INodeRefs,
  ITransform,
  ICoordinateType,
  NodeTypeEnum,
  INodeType,
} from '../../types'
import { isEqual } from 'lodash-es'
import useEventCallback from '../../hooks/useEventCallback'
import { batchUpdateCoordinates, calculatingCoordinates, findIndexById, oneNodeDelete } from '../../utils'
import { createNode } from '../NodeTypes/config'
// import { MarkLine } from './MarkLine'
import { SelectModel } from './SelectModel'
import autoLayout, { autoLayoutAnimation, diffNodesCoordinates } from '../../utils/autoLayout'
import { EVENT_AUTO_LAYOUT } from '../../utils/eventBus'
import useEventBus from '../../hooks/useEventBus'
import { createSinglePasteValue } from '../../utils/copyPaste'
interface DiagramProps {
  value: IDiagramType
  onChange: (value: IDiagramType, notAddHistory?: boolean) => void
  onAddHistory: (value: IDiagramType) => void
  transform: ITransform
  activeNodeIds: string[]
  onToggleActiveNodeId: (nodeId: string) => void
}
const STEP_COUNT = 60 // auto layout 动画执行总次数

export const Diagram: React.FC<DiagramProps> = React.memo((props) => {
  const { value, onChange, onAddHistory, transform, activeNodeIds, onToggleActiveNodeId } = props
  const [segment, setSegment] = useState<ISegmentType | undefined>()
  const [selectModelPosition, setSelectModelPosition] = useState<ICoordinateType>()
  const { current: portRefs } = useRef<IPortRefs>({}) // 保存所有 Port 的 Dom 节点
  const { current: nodeRefs } = useRef<INodeRefs>({}) // 保存所有 Node 的 Dom 节点
  const startPortIdRef = useRef<string>() // 保存所有 Node 的 Dom 节点
  const isAutoLayoutRef = useRef<boolean>(false) // 保存所有 Node 的 Dom 节点

  const handleNodePositionChange = useEventCallback((nodeId: string, nextCoordinates: ICoordinateType) => {
    const nextNodes = batchUpdateCoordinates(nodeId, nextCoordinates, value.nodes, activeNodeIds)
    onChange({ ...value, nodes: nextNodes }, true)
  })

  const handleNodeValueChange = useEventCallback((nodeId: string, nextNodeValue: any) => {
    const nextNodes = [...value.nodes]
    const index = findIndexById(nodeId, nextNodes)
    nextNodes[index] = { ...nextNodes[index], data: nextNodeValue }
    onChange({ ...value, nodes: nextNodes })
  })

  const handleAddHistory = useEventCallback((nodeId: string, nextCoordinates: ICoordinateType) => {
    const nextNodes = batchUpdateCoordinates(nodeId, nextCoordinates, value.nodes, activeNodeIds)
    onAddHistory({ ...value, nodes: nextNodes })
  })

  const handleNodeCopy = useEventCallback((nodeId: string) => {
    const index = findIndexById(nodeId, value.nodes)
    const newNode = createSinglePasteValue(value.nodes[index])
    onChange({ ...value, nodes: [...value.nodes, newNode] })
  })

  const handleNodeDelete = useEventCallback((nodeId: string) => {
    const nextValue = oneNodeDelete(value, nodeId)
    onChange(nextValue)
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
  const onDragNewSegment = useCallback((portId: string, from: ICoordinateType, to: ICoordinateType) => {
    setSegment({ id: `segment-${portId}`, from, to })
  }, [])

  // when a segment fails to connect, reset the segment state
  const onSegmentFail = useCallback(() => {
    setSegment(undefined)
  }, [])

  const onShowSelectModel = useEventCallback((event: MouseEvent, input: string) => {
    startPortIdRef.current = input
    setSelectModelPosition([event.clientX, event.clientY])
    setSegment(undefined)
  })

  // when a segment connects, update the links schema, perform the onChange callback
  // with the new data, then reset the segment state
  const onSegmentConnect = useEventCallback((input: string, output: string) => {
    const linkIsExists = value.links.findIndex((link) => link.input === input && link.output === output) > -1
    if (!linkIsExists) {
      const nextLinks = [...value.links, { input, output }]

      onChange({ ...value, links: nextLinks })
    }
    setSegment(undefined)
  })

  // when links change, performs the onChange callback with the new incoming data
  const onLinkDelete = useEventCallback((link: ILinkType) => {
    const nextLinks = value.links.filter((item) => !isEqual(item, link))
    onChange({ ...value, links: nextLinks })
  })

  const handleSelectModelChange = useEventCallback((nodeType?: NodeTypeEnum) => {
    if (nodeType && selectModelPosition) {
      const coordinates: ICoordinateType = calculatingCoordinates(
        { clientX: selectModelPosition[0], clientY: selectModelPosition[1] } as MouseEvent,
        document.getElementById('diagram-canvas'),
        transform.scale
      )
      const newNode = createNode(nodeType, coordinates)
      onChange({ ...value, nodes: [...value.nodes, newNode] })
      // nodes 更新后 渲染 link
      setTimeout(() => {
        onSegmentConnect(startPortIdRef.current || '', newNode.id)
      }, 20)
    }
    setSelectModelPosition(undefined)
  })

  const handleAutoLayout = useCallback(() => {
    const nextValue = autoLayout(value, nodeRefs)
    if (diffNodesCoordinates(value.nodes, nextValue.nodes) && !isAutoLayoutRef.current) {
      const params = {
        originNodes: value.nodes,
        futureNodes: nextValue.nodes,
        animationFn: (nodes: INodeType[]) => onChange({ ...nextValue, nodes: nodes }, true),
        stepCount: STEP_COUNT,
      }
      isAutoLayoutRef.current = true

      autoLayoutAnimation(params)
        .then(() => {
          onAddHistory(value) // 成功后把原始位置追加到历史记录
        })
        .finally(() => (isAutoLayoutRef.current = false))
    }
  }, [value, nodeRefs, onChange, onAddHistory, isAutoLayoutRef])

  useEventBus({ type: EVENT_AUTO_LAYOUT, onChange: handleAutoLayout })

  return (
    <DiagramCanvas
      portRefs={portRefs}
      nodeRefs={nodeRefs}
      transform={transform}
      onDragNewSegment={onDragNewSegment}
      onSegmentFail={onSegmentFail}
      onSegmentConnect={onSegmentConnect}
      onShowSelectModel={onShowSelectModel}
      onPortMount={onPortRegister}
    >
      <NodesCanvas
        nodes={value.nodes}
        onNodeMount={onNodeRegister}
        onNodePositionChange={handleNodePositionChange}
        onNodeValueChange={handleNodeValueChange}
        onNodeDelete={handleNodeDelete}
        onNodeCopy={handleNodeCopy}
        onAddHistory={handleAddHistory}
        onToggleActiveNodeId={onToggleActiveNodeId}
        activeNodeIds={activeNodeIds}
      />
      {value.links.length > 0 && <LinksCanvas nodes={value.nodes} links={value.links} onDelete={onLinkDelete} />}
      {segment && <Segment segment={segment} />}
      {/* <MarkLine onNodePositionChange={handleNodePositionChange} /> */}
      <SelectModel position={selectModelPosition} onChange={handleSelectModelChange} />
    </DiagramCanvas>
  )
})

Diagram.displayName = 'Diagram'
