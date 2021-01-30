import React from 'react'
import { Select } from 'antd'

import './style.scss'
import { INodeItemProps } from '../../types'
import { NodeTypeHeader } from './NodeTypeHeader'
import { nodesConfig } from './config'


export interface NodeTypeSelectProps extends INodeItemProps<any> {

}


export const NodeTypeSelect: React.FC<NodeTypeSelectProps> = ({value, onChange}) => {

  function handleChange(e: string) {
    onChange({...value, selectValue: e})
  }


  return (
    <>
      <NodeTypeHeader icon={nodesConfig.nodeTypeSelect.icon} label={nodesConfig.nodeTypeSelect.label}/>
      <Select style={{width: 120}} value={value.selectValue} onChange={handleChange}>
        <Select.Option value="jack">Jack</Select.Option>
        <Select.Option value="lucy">Lucy</Select.Option>
        <Select.Option value="disabled" disabled>
          Disabled
        </Select.Option>
        <Select.Option value="Yiminghe">yiminghe</Select.Option>
      </Select>
    </>
  )
}

NodeTypeSelect.displayName = 'NodeTypeSelect'
