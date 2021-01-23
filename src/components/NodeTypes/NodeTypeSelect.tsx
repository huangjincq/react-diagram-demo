import React, { useMemo, useState } from 'react'
import { Select } from "antd"

import "./style.scss"

export interface NodeTypeInputProps {

}


export const NodeTypeSelect: React.FC<NodeTypeInputProps> = ({}) => {
  function handleChange(value: string) {
    console.log(`selected ${value}`)
  }

  return (
    <>
      <Select defaultValue="lucy" style={{width: 120}} onChange={handleChange}>
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
