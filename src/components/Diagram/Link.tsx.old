import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import makeSvgPath from '../../utils/makeSvgPath'
import { LinkDelete } from './LinkDelete'
import { ICoordinateType, ILinkType } from '../../types'
import { getPathMidpoint } from '../../utils'
import { isEqual } from 'lodash-es'

interface LinkProps {
  input: ICoordinateType
  output: ICoordinateType
  link: ILinkType
  onDelete: (link: ILinkType) => void
}

export const Link: React.FC<LinkProps> = React.memo(
  (props) => {
    const { input, output, link, onDelete } = props
    const pathRef = useRef<SVGPathElement>(null)
    const [labelPosition, setLabelPosition] = useState<ICoordinateType>()

    /*
     * 根据亮点坐标生成 svg path 路径
     * */
    const path = useMemo(() => makeSvgPath(input, output), [input, output])

    useEffect(() => {
      if (pathRef.current) {
        setLabelPosition(getPathMidpoint(pathRef.current))
      }
    }, [pathRef, input, output])

    const handleDelete = useCallback(() => {
      onDelete(link)
    }, [onDelete, link])

    return (
      <g className={'diagram-link'}>
        <path d={path} className="bi-link-ghost" />
        <path d={path} ref={pathRef} className="bi-link-path" />
        {labelPosition && <LinkDelete position={labelPosition} onDelete={handleDelete} />}
      </g>
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
