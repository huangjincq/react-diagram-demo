import React, { useMemo } from 'react'
import { Link } from './Link'
import { ILinkType, INodeType, ICoordinateType, IPortRefs, INodeRefs, IPointType } from '../../types'
import { useDiagramManager } from '../Context/DiagramManager'

interface LinkCanvasProps {
  nodes: INodeType[]
  links: ILinkType[]
  onDelete: (link: ILinkType) => void
}

/*
 * link 起点终点 数据类型
 * */
export interface EntityPutType {
  startCoordinates: ICoordinateType
  endCoordinates: ICoordinateType
  link: ILinkType
}

const findPortCoordinate = (
  nodeCoordinates: ICoordinateType,
  ports: IPointType[],
  entityId: string,
  portRefs: IPortRefs
): ICoordinateType | null => {
  for (let j = 0; j < ports.length; j++) {
    const input = ports[j]
    if (input.id === entityId) {
      const portDom = portRefs[entityId]
      if (!portDom) return null
      return [
        nodeCoordinates[0] + portDom.offsetLeft + portDom.offsetWidth / 2,
        nodeCoordinates[1] + portDom.offsetTop + portDom.offsetHeight / 2,
      ]
    }
  }
  return null
}

/*
 * 计算 link 起点终点坐标
 * 1. 如果找到 id 是 node 类型线，实际坐标为 x 为该 node 的 left 值，y坐标为该node 的 top + node高度的一半
 * 2. 如果找到 id 是 port 类型线，实际坐标为 x 为该 port 的 父元素 node 的 left + 点相对 node 的偏移量 +点的宽度的一半，y 轴坐标同理
 * */
const computedLinkCoordinate = (
  nodes: INodeType[],
  entityId: string,
  nodeRefs: INodeRefs,
  portRefs: IPortRefs,
  canvasRef: HTMLDivElement | null
): ICoordinateType | null => {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    // 如果 id 是 nodeId
    if (node.id === entityId) {
      const nodeEl = nodeRefs[entityId]
      if (!nodeEl) return null
      return [node.coordinates[0], node.coordinates[1] + nodeEl.offsetHeight / 2]
    } else {
      const inputRes = findPortCoordinate(node.coordinates, node.inputs, entityId, portRefs)
      if (inputRes) return inputRes

      const outputRes = findPortCoordinate(node.coordinates, node.outputs, entityId, portRefs)
      if (outputRes) return outputRes
    }
  }
  return null
}

export const LinksCanvas: React.FC<LinkCanvasProps> = React.memo((props) => {
  const { nodes, onDelete, links } = props

  const { canvasRef, portRefs, nodeRefs } = useDiagramManager()

  const result = useMemo(() => {
    const res: EntityPutType[] = []

    links.forEach((link) => {
      const { input, output } = link
      const startCoordinates = computedLinkCoordinate(nodes, input, nodeRefs, portRefs, canvasRef)
      const endCoordinates = computedLinkCoordinate(nodes, output, nodeRefs, portRefs, canvasRef)
      if (startCoordinates && endCoordinates) {
        res.push({
          link,
          startCoordinates,
          endCoordinates,
        })
      }
    })
    return res
  }, [nodes, links, nodeRefs, portRefs, canvasRef])

  return (
    <svg className="diagram-link-canvas">
      {result.map((item) => (
        <Link
          link={item.link}
          input={item.startCoordinates}
          output={item.endCoordinates}
          onDelete={onDelete}
          key={`${item.link.input}-${item.link.output}`}
        />
      ))}
    </svg>
  )
})
LinksCanvas.displayName = 'LinksCanvas'
