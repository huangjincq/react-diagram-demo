import React from 'react'
import { Button } from 'antd'

import './style.scss'
import { INodeItemProps } from '../../types'
import { NodeTypeHeader } from './NodeTypeHeader'
import { nodesConfig } from './config'

export interface NodeTypeButtonProps extends INodeItemProps<any> {
}

export const NodeTypeButton: React.FC<NodeTypeButtonProps> = (props) => {
  const {value} = props
  // const handleInputChange = (e: any) => {
  //   onChange({
  //     ...value,
  //     inputValue: e.target.value,
  //   })
  // }

  return (
    <>
      <NodeTypeHeader icon={nodesConfig.nodeTypeButton.icon} label={nodesConfig.nodeTypeButton.label}/>
      {value.buttonList.map((button: any, index: number) => (
        <div key={index}>
          <Button style={{width: '100%'}}>{button.text as string}</Button>
        </div>
      ))}
    </>
  )
}

NodeTypeButton.displayName = 'NodeTypeButton'
