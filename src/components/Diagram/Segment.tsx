import React, { useMemo } from 'react'
import makeSvgPath from '../../utils/makeSvgPath'
import { ISegmentType } from '../../types'

export interface SegmentProps {
  segment: ISegmentType
}

export const Segment: React.FC<SegmentProps> = React.memo(({segment}) => {
  const {from, to, id} = segment
  const path = useMemo(() => makeSvgPath(from, to), [from, to])

  return (
    <svg className="diagram-segment-canvas">
      <g className="diagram-segment-link" id={id}>
        <path d={path}/>
        <circle r="5" cx={to[0]} cy={to[1]}/>
      </g>
    </svg>
  )
})

Segment.displayName = 'Segment'


