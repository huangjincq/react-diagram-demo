import { ICoordinateType } from '../types'


// 计算 鼠标事件 相对在 diagram 画布内的坐标
export const calculatingCoordinates = (event: MouseEvent, diagramDom: HTMLDivElement | null, scale: number): ICoordinateType => {
  const diagramDomRect = diagramDom?.getBoundingClientRect() || {x: 0, y: 0}
  return [(event.clientX - diagramDomRect.x) / scale, (event.clientY - diagramDomRect.y) / scale]
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
