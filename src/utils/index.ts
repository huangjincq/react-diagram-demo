import { ICoordinateType, INodeType } from '../types'

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

export const getPathMidpoint = (pathElement: SVGPathElement): ICoordinateType => {
  if (pathElement.getTotalLength && pathElement.getPointAtLength) {
    const midpoint = pathElement.getTotalLength() / 2
    const { x, y } = pathElement.getPointAtLength(midpoint)
    return [x, y]
  }

  return [0, 0]
}

export const findIndexById = (nodeId: string, nodes: INodeType[]) => nodes.findIndex((node) => node.id === nodeId)
