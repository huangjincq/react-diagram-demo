import React from 'react'
import {AppleOutlined} from '@ant-design/icons';

import "./style.scss"

export interface NodeListItemProps {

}


export const NodeListItem: React.FC<NodeListItemProps> = React.memo(({}) => {
  return (
    <div className="node-list-item" draggable>
      <AppleOutlined className='node-list-icon'/>
      <div className="node-list-text">你好是啊啊是</div>
    </div>
  )
})
NodeListItem.displayName = 'NodeListItem'

