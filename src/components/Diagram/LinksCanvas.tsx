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

export const LinksCanvas: React.FC<LinkCanvasProps> = React.memo((props) => {
  const { nodes, onDelete, links } = props

  const { canvasRef, portRefs, nodeRefs, scale } = useDiagramManager()

  const result = useMemo(() => {
    const res: EntityPutType[] = []

    links.forEach((link) => {
      const { input, output } = link
      const startCoordinates = computedLinkCoordinate({
        nodes,
        entityId: input,
        nodeRefs,
        portRefs,
        canvasRef,
        scale,
      })
      const endCoordinates = computedLinkCoordinate({
        nodes,
        entityId: output,
        nodeRefs,
        portRefs,
        canvasRef,
        scale,
      })
      if (startCoordinates && endCoordinates) {
        res.push({
          link,
          startCoordinates,
          endCoordinates,
        })
      }
    })
    return res
    //  eslint-disable-next-line
  }, [nodes, links, nodeRefs, portRefs, canvasRef]) // 不要依赖 scale 因为缩放的时候不用重新计算位置

  return (
    <>
      {result.map((item) => (
        <Link
          link={item.link}
          input={item.startCoordinates}
          output={item.endCoordinates}
          onDelete={onDelete}
          key={`${item.link.input}-${item.link.output}`}
        />
      ))}
    </>
  )
})
LinksCanvas.displayName = 'LinksCanvas'

/*
 * 计算点相对于node左上角的相对值
 */
export const calculatingPortRelativeNode = (nodeDom: Element, portDom: Element, scale: number) => {
  const nodeRect = nodeDom.getBoundingClientRect()
  const portRect = portDom.getBoundingClientRect()
  return {
    offsetLeft: (portRect.left - nodeRect.left) / scale,
    offsetTop: (portRect.top - nodeRect.top) / scale,
  }
}

/*
 * 计算点的坐标
 */

interface IFindPortCoordinate {
  nodeCoordinates: ICoordinateType
  ports: IPointType[]
  entityId: string
  portRefs: IPortRefs
  nodeDom: HTMLDivElement
  scale: number
}
const findPortCoordinate = ({
  nodeCoordinates,
  ports,
  entityId,
  portRefs,
  nodeDom,
  scale,
}: IFindPortCoordinate): ICoordinateType | null => {
  for (let j = 0; j < ports.length; j++) {
    const input = ports[j]

    if (input.id === entityId) {
      const portDom = portRefs[entityId]

      if (!portDom) return null

      // const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = portDom
      const { offsetWidth, offsetHeight } = portDom
      // 不依赖 position absolute 定位 可以随意渲染 port 位置
      const { offsetLeft, offsetTop } = calculatingPortRelativeNode(nodeDom, portDom, scale)

      return [nodeCoordinates[0] + offsetLeft + offsetWidth / 2, nodeCoordinates[1] + offsetTop + offsetHeight / 2]
    }
  }
  return null
}

/*
 * 计算 link 起点终点坐标
 * 1. 如果找到 id 是 node 类型线，实际坐标为 x 为该 node 的 left 值，y坐标为该node 的 top + node高度的一半
 * 2. 如果找到 id 是 port 类型线，实际坐标为 x 为该 port 的 父元素 node 的 left + 点相对 node 的偏移量 +点的宽度的一半，y 轴坐标同理
 * */
interface IComputedLinkCoordinate {
  nodes: INodeType[]
  entityId: string
  nodeRefs: INodeRefs
  portRefs: IPortRefs
  canvasRef: HTMLDivElement | null
  scale: number
}

const computedLinkCoordinate = ({
  nodes,
  entityId,
  nodeRefs,
  portRefs,
  canvasRef,
  scale,
}: IComputedLinkCoordinate): ICoordinateType | null => {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    const nodeEl = nodeRefs[node.id]

    // 如果 id 是 nodeId
    if (node.id === entityId) {
      if (!nodeEl) return null
      return [node.coordinates[0], node.coordinates[1] + nodeEl.offsetHeight / 2]
    } else {
      const inputRes = findPortCoordinate({
        nodeCoordinates: node.coordinates,
        ports: node.inputs,
        entityId,
        portRefs,
        nodeDom: nodeEl,
        scale,
      })
      if (inputRes) return inputRes

      const outputRes = findPortCoordinate({
        nodeCoordinates: node.coordinates,
        ports: node.outputs,
        entityId,
        portRefs,
        nodeDom: nodeEl,
        scale,
      })

      if (outputRes) return outputRes
    }
  }
  return null
}
