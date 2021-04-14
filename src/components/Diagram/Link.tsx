import React, { useCallback, useMemo, useRef } from 'react'
import makeSvgPath from '../../utils/makeSvgPath'
import { ICoordinateType, ILinkType } from '../../types'
import { isEqual } from 'lodash-es'
import { computedLinkSvgInfo } from '../../utils'

interface LinkProps {
  input: ICoordinateType
  output: ICoordinateType
  link: ILinkType
  onDelete: (link: ILinkType) => void
}

export const Link: React.FC<LinkProps> = React.memo(
  (props) => {
    const { input, output, link, onDelete } = props
    const svgRef = useRef<SVGSVGElement>(null)

    /*
     * 画出 link 的 svg 矩形容器，和位置，并且重新计算在 矩形容器内的起点和终点
     * */
    const { width, height, left, top, start, end } = useMemo(() => computedLinkSvgInfo(input, output), [input, output])

    /*
     * 根据两点坐标生成 svg path 路径
     * */
    const path = useMemo(() => makeSvgPath(start as ICoordinateType, end as ICoordinateType), [start, end])

    const handleDelete = useCallback(() => {
      onDelete(link)
    }, [onDelete, link])

    const handleMouseOver = useCallback(() => {
      svgRef.current?.classList.add('hover')
    }, [])

    const handleMouseOut = useCallback(() => {
      svgRef.current?.classList.remove('hover')
    }, [])

    return (
      <svg
        ref={svgRef}
        className={'diagram-link'}
        style={{ left, top }}
        width={width}
        height={height}
        pointerEvents="none"
      >
        <path d={path} className="bi-link-path" />
        <path
          d={path}
          className="bi-link-ghost"
          onDoubleClick={handleDelete}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        />
      </svg>
    )
  },
  (prev, next) => {
    /*
     *  memo 默认是浅比较 只比较 props 第一层
     *  由于 props 上面 的 input output 等属性在外层每次会重新创建 导致浅层 比较地址 永远等于 false ，使得组件每次都会render 导致memo无效
     * 所以使用 isEqual 进行值的比较 进行优化
     */
    return isEqual(prev, next)
  }
)

Link.displayName = 'Link'
