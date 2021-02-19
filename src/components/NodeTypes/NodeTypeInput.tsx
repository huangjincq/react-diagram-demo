import React from 'react'
import { Input } from 'antd'

import './style.scss'
import { INodeItemProps } from '../../types'
import { NodeTypeHeader } from './NodeTypeHeader'
import { nodesConfig } from './config'

export interface NodeTypeInputProps extends INodeItemProps<any> {
}


export const NodeTypeInput: React.FC<NodeTypeInputProps> = (props) => {

  const {value, onChange} = props
  const handleInputChange = (e: any) => {
    onChange({
      ...value,
      inputValue: e.target.value
    })
  }

  return (
    <>
      <NodeTypeHeader icon={nodesConfig.nodeTypeInput.icon} label={nodesConfig.nodeTypeInput.label}/>
      <Input value={value.inputValue} onChange={handleInputChange} placeholder="Basic usage"/>
    </>
  )
}

NodeTypeInput.displayName = 'NodeTypeInput'
