import React, { useMemo } from 'react'
import makeSvgPath from '../../shared/functions/makeSvgPath'
import { ISegmentType } from "../../../types"


export interface SegmentProps {
  segment: ISegmentType
}

export const Segment: React.FC<SegmentProps> = React.memo(({segment}) => {
  const {from, to, id} = segment
  const path = useMemo(() => makeSvgPath(from, to), [from, to])

  return (
    <svg className="bi bi-diagram-segment-layer">
      <g className="bi-diagram-segment" id={id}>
        <path d={path}/>
        <circle r="6.5" cx={to[0]} cy={to[1]}/>
      </g>
    </svg>
  )
})

Segment.displayName = 'Segment'


