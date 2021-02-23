import React, { useCallback } from 'react'

import './style.scss'

export interface NodeListItemProps {
  icon: React.FC
  label: string
  type: string
}

export const NodeListItem: React.FC<NodeListItemProps> = React.memo(({ icon, label, type }) => {
  const handleDragStart = useCallback(
    (event: any) => {
      event.dataTransfer?.setData('nodeType', type)
    },
    [type]
  )
  return (
    <div className="node-list-item" draggable onDragStart={handleDragStart}>
      {icon && React.createElement(icon)}
      <div className="node-list-text">{label}</div>
    </div>
  )
})

NodeListItem.displayName = 'NodeListItem'
