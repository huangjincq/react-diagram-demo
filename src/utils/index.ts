import { ICoordinateType, IDiagramType, INodeStyle, INodeType } from '../types'
import hotkeys from 'hotkeys-js'

// 计算 鼠标事件 相对在 参照物(diagram 画布)内的坐标
export const calculatingCoordinates = (
  event: MouseEvent,
  referenceDom: HTMLDivElement | HTMLElement | null,
  scale: number
): ICoordinateType => {
  const referenceDomRect = referenceDom?.getBoundingClientRect() || { x: 0, y: 0 }
  return [
    getInteger((event.clientX - referenceDomRect.x) / scale),
    getInteger((event.clientY - referenceDomRect.y) / scale),
  ]
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
          coordinates: [
            getInteger(node.coordinates[0] + offsetCoordinate.xOffset),
            getInteger(node.coordinates[1] + offsetCoordinate.yOffset),
          ],
        }
        return true
      } else {
        return false
      }
    })
  })
  // update self
  nextNodes[index] = {
    ...nextNodes[index],
    coordinates: [getInteger(nextCoordinates[0]), getInteger(nextCoordinates[1])],
  }

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
export const checkWheelDirection = (event: WheelEvent) => {
  return {
    wheelDown: event.deltaY > 0,
    wheelUp: event.deltaY < 0,
  }
}

/*
 * 计算滚轮滚动距离
 */
export const computedWheelDelta = (event: WheelEvent) => {
  const SENSITIVITY = 2 // 设置灵敏度
  let deltaX = event.deltaX / SENSITIVITY
  let deltaY = event.deltaY / SENSITIVITY

  if (!isMac && hotkeys.shift) {
    deltaX = deltaY
    deltaY = 0
  }

  return {
    deltaX,
    deltaY,
  }
}

const BASE_NUM = 2
export const getInteger = (num: number) => {
  const integer = Math.floor(num / BASE_NUM)
  let remainder = num % BASE_NUM

  remainder = remainder > BASE_NUM / 2 ? BASE_NUM : 0

  const res = integer * BASE_NUM + remainder
  return res
}

export const isMac = (() => /macintosh|mac os x/i.test(navigator.userAgent))()

export const isTriggerScale = (event: WheelEvent) => (isMac ? hotkeys.command || event.ctrlKey : hotkeys.ctrl)
