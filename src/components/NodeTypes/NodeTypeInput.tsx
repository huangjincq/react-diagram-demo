import React from 'react'
import { Input, Collapse } from 'antd'
import './style.scss'
import { INodeItemProps } from '../../types'
import { NodeTypeHeader } from './NodeTypeHeader'
import { nodesConfig } from './config'
const { TextArea } = Input

export interface NodeTypeInputProps extends INodeItemProps<any> {}

export const NodeTypeInput: React.FC<NodeTypeInputProps> = (props) => {
  const { value, onChange } = props
  const handleInputChange = (e: any) => {
    onChange({
      ...value,
      inputValue: e.target.value,
    })
  }

  return (
    <>
      <NodeTypeHeader icon={nodesConfig.nodeTypeInput.icon} label={nodesConfig.nodeTypeInput.label} />
      <div className="node-content">
        <TextArea placeholder="Input message here" rows={2} value={value.inputValue} onChange={handleInputChange} />
      </div>
    </>
  )
}

NodeTypeInput.displayName = 'NodeTypeInput'
