import React, { ChangeEvent, useMemo, useState } from 'react'
import { Input } from 'antd'

import './style.scss'
import { INodeItemProps } from '../../types'

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
      <Input value={value.inputValue} onChange={handleInputChange} placeholder="Basic usage"/>
    </>
  )
}

NodeTypeInput.displayName = 'NodeTypeInput'
