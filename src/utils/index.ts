import { ICoordinateType, IDiagramType, INodeStyle, INodeType, IPasteLinkType, ITransform } from '../types'
import { v4 as uuidv4 } from 'uuid'
import { minBy } from 'lodash-es'

// 计算 鼠标事件 相对在 参照物(diagram 画布)内的坐标
export const calculatingCoordinates = (
  event: MouseEvent,
  referenceDom: HTMLDivElement | HTMLElement | null,
  scale: number
): ICoordinateType => {
  const referenceDomRect = referenceDom?.getBoundingClientRect() || { x: 0, y: 0 }
  return [(event.clientX - referenceDomRect.x) / scale, (event.clientY - referenceDomRect.y) / scale]
}

export const findEventTargetParentNodeId = (dom: HTMLElement | null): null | string => {
  if (!dom) {
    return null
  }
  const nodeId = dom.id
  const isNodeDom = dom.classList.contains('diagram-node')
  if (nodeId && isNodeDom) {
    return nodeId
  }
  if (isNodeDom) {
    return null
  }
  return findEventTargetParentNodeId(dom.parentElement)
}

// 检测鼠标按下的时候是否是点击在画布空白区域
export const checkMouseDownTargetIsDrawPanel = (event: any, panelDom: HTMLElement | null) =>
  event.target === panelDom || event.target === panelDom?.firstChild

// 碰撞检测 检测两个div 是否相交
export const collideCheck = (dom1: HTMLElement | null, dom2: HTMLElement | null) => {
  if (dom1 && dom2) {
    const rect1 = dom1.getBoundingClientRect()
    const rect2 = dom2.getBoundingClientRect()
    const maxX: number = Math.max(rect1.x + rect1.width, rect2.x + rect2.width)
    const maxY: number = Math.max(rect1.y + rect1.height, rect2.y + rect2.height)
    const minX: number = Math.min(rect1.x, rect2.x)
    const minY: number = Math.min(rect1.y, rect2.y)
    return maxX - minX <= rect1.width + rect2.width && maxY - minY <= rect1.height + rect2.height
  }
  return false
}

export const findIndexById = (nodeId: string, nodes: INodeType[]) => nodes.findIndex((node) => node.id === nodeId)

export const getNodeStyle = (nodeDom: Element): INodeStyle => {
  const dom = nodeDom as HTMLElement
  const width = dom.offsetWidth
  const height = dom.offsetHeight
  return {
    width,
    height,
    left: dom.offsetLeft,
    top: dom.offsetTop,
    right: dom.offsetLeft + width,
    bottom: dom.offsetTop + height,
  }
}

export const batchUpdateCoordinates = (
  nodeId: string,
  nextCoordinates: ICoordinateType,
  nodes: INodeType[],
  activeNodeIds: string[]
): INodeType[] => {
  const nextNodes = [...nodes]

  const index = findIndexById(nodeId, nextNodes)

  const offsetCoordinate = {
    xOffset: nextCoordinates[0] - nodes[index].coordinates[0],
    yOffset: nextCoordinates[1] - nodes[index].coordinates[1],
  }
  // update activeNodeIds
  activeNodeIds.forEach((activeNodeId) => {
    nextNodes.some((node, nextIndex) => {
      if (node.id === activeNodeId) {
        nextNodes[nextIndex] = {
          ...nextNodes[nextIndex],
          coordinates: [node.coordinates[0] + offsetCoordinate.xOffset, node.coordinates[1] + offsetCoordinate.yOffset],
        }
        return true
      } else {
        return false
      }
    })
  })
  // update self
  nextNodes[index] = { ...nextNodes[index], coordinates: nextCoordinates }

  return nextNodes
}

export const oneNodeDelete = (value: IDiagramType, nodeId: string): IDiagramType => {
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
  return { links: nextLinks, nodes: nextNodes }
}

export const checkIsFocusInPanel = (panelDom: HTMLElement | null) => document.activeElement === panelDom

/*
 * 画出 link 的 svg 矩形容器，和位置，并且重新计算在 矩形容器内的起点和终点
 * */
export const computedLinkSvgInfo = (input: ICoordinateType, output: ICoordinateType) => {
  const width = Math.abs(output[0] - input[0])
  const height = Math.abs(output[1] - input[1])
  const MIN_SIZE = 1
  let left = 0
  let top = 0
  const start = { x: 0, y: 0 }
  const end = { x: 0, y: 0 }

  // x 轴防方向
  if (output[0] > input[0]) {
    left = input[0]

    start.x = 0
    end.x = width
  } else {
    left = output[0]

    start.x = width
    end.x = 0
  }

  // y 轴防方向
  if (output[1] > input[1]) {
    top = input[1]

    start.y = 0
    end.y = height
  } else {
    top = output[1]

    start.y = height
    end.y = 0
  }

  return {
    width: Math.floor(width) || MIN_SIZE,
    height: Math.floor(height) || MIN_SIZE,
    left: Math.floor(left),
    top: Math.floor(top),
    start: [start.x, start.y],
    end: [end.x, end.y],
  }
}

/*
 * 检测鼠标滚轮方向
 */
export const checkWheelDirection = (event: any) => {
  let wheelDown = false
  let wheelUp = false

  // in chrome
  if (event.wheelDelta) {
    wheelDown = event.wheelDelta < 0
    wheelUp = event.wheelDelta > 0
    // in firefox
  } else {
    wheelDown = event.deltaX > 0 || event.deltaY > 0 || event.deltaZ > 0
    wheelUp = event.deltaX < 0 || event.deltaY < 0 || event.deltaZ < 0
  }
  return {
    wheelDown,
    wheelUp,
  }
}

/*
 * 生成copy数据
 */
export const createCopyValue = (value: IDiagramType, activeNodeIds: string[]) => {
  const newNodes = value.nodes.filter((node) => activeNodeIds.includes(node.id))

  return {
    nodes: newNodes,
    links: value.links,
  }
}

const updatePasteLink = (links: IPasteLinkType[], oldId: string, newId: string) =>
  links.map((link) => {
    const inputUpdated = link.input === oldId
    const outputUpdated = link.output === oldId
    return {
      ...link,
      input: inputUpdated ? newId : link.input,
      output: outputUpdated ? newId : link.output,
      inputUpdated: inputUpdated || link.inputUpdated,
      outputUpdated: outputUpdated || link.outputUpdated,
    }
  })

/*
 * 生成copy数据
 */
export const createPasteValue = (value: IDiagramType, offset: { x: number; y: number }) => {
  // 1. 找到原始 node 边界
  const minX = minBy(value.nodes, 'coordinates[0]')?.coordinates[0] || 0
  const minY = minBy(value.nodes, 'coordinates[1]')?.coordinates[1] || 0

  let newLinks: IPasteLinkType[] = value.links

  const newNodes = value.nodes.map((item) => {
    const newNodeId = uuidv4()
    const newCoordinates: ICoordinateType = [
      item.coordinates[0] - minX + offset.x,
      item.coordinates[1] - minY + offset.y,
    ]
    newLinks = updatePasteLink(newLinks, item.id, newNodeId)

    return {
      ...item,
      // 重新设置 node 坐标
      coordinates: newCoordinates,
      inputs: item.inputs.map((port) => {
        const newPortId = uuidv4()
        newLinks = updatePasteLink(newLinks, port.id, newPortId)

        return { ...port, id: newPortId }
      }),
      outputs: item.outputs.map((port) => {
        const newPortId = uuidv4()
        newLinks = updatePasteLink(newLinks, port.id, newPortId)

        return { ...port, id: newPortId }
      }),
      id: newNodeId,
    }
  })

  return {
    nodes: newNodes,
    links: newLinks
      .filter((link) => link.inputUpdated && link.outputUpdated)
      .map(({ inputUpdated, outputUpdated, ...link }) => ({ ...link })),
  }
}

/*
 * 计算在屏幕范围的中心位置，在 画布内的坐标
 */
export const calculatePasteOriginCoordination = (transform: ITransform, panelDom: HTMLDivElement) => {
  const { scale, translateX, translateY } = transform
  const { width, height } = getNodeStyle(panelDom)

  return {
    x: -translateX / scale + width / scale / 3,
    y: -translateY / scale + height / scale / 2,
  }
}
