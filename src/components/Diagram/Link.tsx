import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import makeSvgPath from '../../utils/makeSvgPath'
import { LinkDelete } from './LinkDelete'
import { ICoordinateType, ILinkType } from '../../types'
import { getPathMidpoint } from '../../utils'
import { isEqual } from 'lodash-es'

const computedSvnInfo = (input: ICoordinateType, output: ICoordinateType) => {
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
    width: width || MIN_SIZE,
    height: height || MIN_SIZE,
    left,
    top,
    start: [start.x, start.y],
    end: [end.x, end.y],
  }
}

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
     * 画出 svg 矩形容器，和位置，并且重新计算在 矩形容器内的起点和终点
     * */
    const { width, height, left, top, start, end } = useMemo(() => computedSvnInfo(input, output), [input, output])

    const labelPosition: any = [width / 2, height / 2]

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
        <path d={path} className="bi-link-ghost" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} />
        <LinkDelete position={labelPosition} onDelete={handleDelete} />
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
