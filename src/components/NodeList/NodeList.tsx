import React, { memo } from 'react'
import './style.scss'
import { NodeListItem } from './NodeListItem'
import { nodesList } from '../NodeTypes/config'

export interface NodeListProps {}

export const NodeList: React.FC<NodeListProps> = memo(() => {
  return (
    <div className="node-list">
      {nodesList.map((node) => (
        <NodeListItem key={node.type} icon={node.icon} type={node.type} label={node.label} />
      ))}
    </div>
  )
})

NodeList.displayName = 'NodeList'
