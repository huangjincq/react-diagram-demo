import React from 'react'
import { Input } from 'antd'
import './style.scss'
import { INodeItemProps } from '../../types'
import { NodeTypeHeader } from './NodeTypeHeader'
import { nodesConfig } from './config'
const { TextArea } = Input

export interface nodeTypeSingleOutputsProps extends INodeItemProps<any> {}

export const nodeTypeSingleOutputs: React.FC<nodeTypeSingleOutputsProps> = (props) => {
  const { value, onChange } = props
  const handleInputChange = (e: any) => {
    onChange({
      ...value,
      inputValue: e.target.value,
    })
  }

  return (
    <>
      <NodeTypeHeader icon={nodesConfig.nodeTypeSingleOutputs.icon} label={nodesConfig.nodeTypeSingleOutputs.label} />
      <div className="node-content">
        <TextArea placeholder="Input message here" rows={2} value={value.inputValue} onChange={handleInputChange} />
      </div>
    </>
  )
}

nodeTypeSingleOutputs.displayName = 'nodeTypeSingleOutputs'
