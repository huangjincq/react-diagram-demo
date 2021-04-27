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
  INodeTypeWithStep,
  INodeType,
} from '../../types'
import { isEqual, omit } from 'lodash-es'
import useEventCallback from '../../hooks/useEventCallback'
import { batchUpdateCoordinates, calculatingCoordinates, findIndexById, oneNodeDelete } from '../../utils'
import { copyNode, createNode } from '../NodeTypes/config'
import { MarkLine } from './MarkLine'
import { SelectModel } from './SelectModel'
import autoLayout, { computedAnimationStep, diffNodesCoordinates } from '../../utils/autoLayout'
import { EVENT_AUTO_LAYOUT } from '../../utils/eventBus'
import useEventBus from '../../hooks/useEventBus'
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

  const nodeWithStepRef = useRef<INodeTypeWithStep[]>([]) // 储存 auto layout node动画每个node 的步长
  const animationCountRef = useRef<number>(0) // 动画执行次数

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
    const newNode = copyNode(value.nodes[index])
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
  const onDragNewSegment = useCallback((portId, from, to) => {
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
    const resultValue = autoLayout(value, nodeRefs)
    if (!diffNodesCoordinates(value.nodes, resultValue.nodes) || animationCountRef.current !== 0) return

    nodeWithStepRef.current = computedAnimationStep(value.nodes, resultValue.nodes, STEP_COUNT)

    const step = () => {
      animationCountRef.current = animationCountRef.current + 1
      nodeWithStepRef.current = nodeWithStepRef.current.map((item) => {
        return {
          ...item,
          coordinates: [item.coordinates[0] + item.xStep, item.coordinates[1] + item.yStep],
        }
      })
      const newNodes: INodeType[] = nodeWithStepRef.current.map((item) => ({ ...omit(item, ['xStep', 'yStep']) }))

      onChange({ ...resultValue, nodes: newNodes }, true) // 不加历史记录

      if (animationCountRef.current < STEP_COUNT) {
        requestAnimationFrame(step)
      } else {
        onChange(resultValue, true) // 不加历史记录
        onAddHistory(value) // 追加原始位置到历史记录
        nodeWithStepRef.current = []
        animationCountRef.current = 0
      }
    }
    requestAnimationFrame(step)
  }, [value, nodeRefs, onChange, nodeWithStepRef, nodeWithStepRef])

  useEventBus({ type: EVENT_AUTO_LAYOUT, onChange: handleAutoLayout })

  return (
    <DiagramCanvas portRefs={portRefs} nodeRefs={nodeRefs} transform={transform}>
      <NodesCanvas
        nodes={value.nodes}
        onNodeMount={onNodeRegister}
        onPortMount={onPortRegister}
        onDragNewSegment={onDragNewSegment}
        onSegmentFail={onSegmentFail}
        onShowSelectModel={onShowSelectModel}
        onNodePositionChange={handleNodePositionChange}
        onNodeValueChange={handleNodeValueChange}
        onNodeDelete={handleNodeDelete}
        onNodeCopy={handleNodeCopy}
        onSegmentConnect={onSegmentConnect}
        onAddHistory={handleAddHistory}
        onToggleActiveNodeId={onToggleActiveNodeId}
        activeNodeIds={activeNodeIds}
      />
      {value.links.length > 0 && <LinksCanvas nodes={value.nodes} links={value.links} onDelete={onLinkDelete} />}
      {segment && <Segment segment={segment} />}
      <MarkLine onNodePositionChange={handleNodePositionChange} />
      <SelectModel position={selectModelPosition} onChange={handleSelectModelChange} />
    </DiagramCanvas>
  )
})

Diagram.displayName = 'Diagram'
