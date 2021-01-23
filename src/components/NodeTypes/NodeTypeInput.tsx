import React, { useMemo, useState } from 'react'
import { Input } from "antd"

import "./style.scss"

export interface NodeTypeInputProps {

}


export const NodeTypeInput: React.FC<NodeTypeInputProps> = ({}) => {


  return (
    <>
      <Input placeholder="Basic usage"/>
    </>
  )
}

NodeTypeInput.displayName = 'NodeTypeInput'
