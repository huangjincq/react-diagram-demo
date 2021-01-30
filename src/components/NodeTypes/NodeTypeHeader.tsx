import React from 'react'

import './style.scss'


export interface NodeTypeHeaderProps {
  icon: React.FC
  label: string;
}


export const NodeTypeHeader: React.FC<NodeTypeHeaderProps> = (props) => {
  const {icon, label} = props

  return (
    <h4 className='node-header'>
      {icon && <div className='node-header-icon'>
        {React.createElement(icon)}
      </div>}
      <div className='node-header-text'>{label}</div>
    </h4>
  )
}

NodeTypeHeader.displayName = 'NodeTypeHeader'
