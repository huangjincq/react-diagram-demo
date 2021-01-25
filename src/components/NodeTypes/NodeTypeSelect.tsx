import React from 'react'
import { Select } from 'antd'

import './style.scss'
import { INodeItemProps } from '../../types'


export interface NodeTypeInputProps extends INodeItemProps<any> {

}


export const NodeTypeSelect: React.FC<NodeTypeInputProps> = ({value, onChange}) => {

  function handleChange(e: string) {
    onChange({...value, selectValue: e})
  }


  return (
    <>
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
