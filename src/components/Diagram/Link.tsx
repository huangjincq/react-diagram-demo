import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import makeSvgPath from '../../utils/makeSvgPath'
import { LinkDelete } from './LinkDelete'
import { ICoordinateType, ILinkType } from '../../types'
import { getPathMidpoint } from '../../utils'

interface LinkProps {
  input: ICoordinateType
  output: ICoordinateType
  link: ILinkType
  onDelete: (link: ILinkType) => void
}

export const Link: React.FC<LinkProps> = React.memo((props) => {
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
})
