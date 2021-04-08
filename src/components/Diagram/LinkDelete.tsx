import React from 'react'
import { ICoordinateType } from '../../types'
import { DeleteOutlined } from '@ant-design/icons'

interface LinkDeleteProps {
  position: ICoordinateType
  onDelete: () => void
}

export const LinkDelete: React.FC<LinkDeleteProps> = React.memo(({ position, onDelete }) => (
  <foreignObject x={position[0]} y={position[1]}>
    <div className="bi-diagram-link-label">
      <DeleteOutlined onClick={onDelete} />
    </div>
  </foreignObject>
))

LinkDelete.displayName = 'LinkDelete'
