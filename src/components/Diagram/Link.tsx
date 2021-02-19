import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import makeSvgPath from '../../utils/makeSvgPath'
import { LinkDelete } from './LinkDelete'
import { ICoordinateType, ILinkType, INodeRefs, IPortRefs } from '../../types'
import { useDiagramManager } from '../Context/DiagramManager'
import { EntityPutType } from './LinksCanvas'
import { getPathMidpoint } from '../../utils'

/*
 * 返回 port 或者 node 在 svg 中 的实际 坐标
 * 1. 如果找到 id 是 node 类型线，实际坐标为 x 为该 node 的 left 值，y坐标为该node 的 top + node高度的一半
 * 1. 如果找到 id 是 port 类型线，实际坐标为 x 为该 port 的 父元素 node 的 left + 点相对 node 的偏移量 +点的宽度的一半，y 轴坐标同理
 * */
const getEntityCoordinates = (
  entity: EntityPutType | undefined,
  portRefs: IPortRefs,
  nodeRefs: INodeRefs,
  canvasRef: HTMLDivElement | null
): ICoordinateType | undefined => {
  if (entity && entity.type === 'node' && nodeRefs[entity.id]) {
    const nodeEl = nodeRefs[entity.id]
    return [entity.coordinates[0], entity.coordinates[1] + nodeEl.offsetHeight / 2]
  }

  if (entity && portRefs && portRefs[entity.id]) {
    const portDom = portRefs[entity.id]
    const parentNodeCoordinates = entity.coordinates

    return [
      parentNodeCoordinates[0] + portDom.offsetLeft + portDom.offsetWidth / 2,
      parentNodeCoordinates[1] + portDom.offsetTop + portDom.offsetHeight / 2
    ]
  }
  return undefined
}

interface LinkProps {
  input?: EntityPutType
  output?: EntityPutType
  link: ILinkType
  onDelete: (link: ILinkType) => void
}

export const Link: React.FC<LinkProps> = React.memo((props) => {
  const {input, output, link, onDelete} = props
  const pathRef = useRef<SVGPathElement>(null)
  const [labelPosition, setLabelPosition] = useState<ICoordinateType>()
  const {canvasRef, portRefs, nodeRefs} = useDiagramManager()

  /*
   * 计算 起点的 坐标
   * 为啥要 依赖 canvasRef 呢
   * 因为：子节点 会比父节点 先 mount， 渲染link的时候port可能还未渲染 ，所以等 canvas层渲染完成后 重新绘制一次线
   * */
  const inputPoint = useMemo(() => getEntityCoordinates(input, portRefs, nodeRefs, canvasRef), [
    input,
    portRefs,
    nodeRefs,
    canvasRef
  ])

  /*
   * 计算 终点的 坐标
   * */
  const outputPoint = useMemo(() => getEntityCoordinates(output, portRefs, nodeRefs, canvasRef), [
    output,
    portRefs,
    nodeRefs,
    canvasRef
  ])

  /*
   * 根据亮点坐标生成 svg path 路径
   * */
  const path = useMemo(() => makeSvgPath(inputPoint, outputPoint), [inputPoint, outputPoint])

  useEffect(() => {
    if (inputPoint && outputPoint && pathRef.current) {
      setLabelPosition(getPathMidpoint(pathRef.current))
    }
  }, [pathRef, inputPoint, outputPoint])

  const onDoubleClick = useCallback(() => {
    onDelete(link)
  }, [onDelete, link])

  return (
    <g className={'diagram-link'}>
      <path d={path} className="bi-link-ghost" onDoubleClick={onDoubleClick}/>
      <path d={path} ref={pathRef} className="bi-link-path" onDoubleClick={onDoubleClick}/>
      {labelPosition && <LinkDelete position={labelPosition}/>}
    </g>
  )
})
