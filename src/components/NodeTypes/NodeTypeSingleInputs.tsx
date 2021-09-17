import React from 'react'
import { Select } from 'antd'
import { Input } from 'antd'
import './style.scss'
import { INodeItemProps } from '../../types'
import { NodeTypeHeader } from './NodeTypeHeader'
import { nodesConfig } from './config'
const { TextArea } = Input

export interface NodeTypeSingleInputsProps extends INodeItemProps<any> {}

export const NodeTypeSingleInputs: React.FC<NodeTypeSingleInputsProps> = ({ value, onChange }) => {
  const handleInputChange = (e: any) => {
    onChange({
      ...value,
      inputValue: e.target.value,
    })
  }

  const handleSelectChange = (e: any) => {
    onChange({
      ...value,
      selectValue: e,
    })
  }

  return (
    <>
      <NodeTypeHeader icon={nodesConfig.nodeTypeSingleInputs.icon} label={nodesConfig.nodeTypeSingleInputs.label} />
      <div className="node-content">
        <TextArea placeholder="Input message here" rows={2} value={value.inputValue} onChange={handleInputChange} />
        <div style={{ marginTop: 8 }}>
          <Select style={{ width: '100%' }} value={value.selectValue} onChange={handleSelectChange}>
            <Select.Option value="jack">Jack</Select.Option>
            <Select.Option value="lucy">Lucy</Select.Option>
            <Select.Option value="disabled">Disabled</Select.Option>
            <Select.Option value="Yiminghe">yiminghe</Select.Option>
          </Select>
        </div>
      </div>
    </>
  )
}

NodeTypeSingleInputs.displayName = 'NodeTypeSingleInputs'
