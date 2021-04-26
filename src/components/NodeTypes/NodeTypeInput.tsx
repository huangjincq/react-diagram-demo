import React from 'react'
import { Input, Collapse } from 'antd'
import './style.scss'
import { INodeItemProps } from '../../types'
import { NodeTypeHeader } from './NodeTypeHeader'
import { nodesConfig } from './config'
const { Panel } = Collapse

const text = `A dog is a type`
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
      <Input value={value.inputValue} onChange={handleInputChange} placeholder="Basic usage" />
      <Collapse defaultActiveKey={['1']}>
        <Panel header="This is panel header 1" key="1">
          <p>{text}</p>
        </Panel>
        <Panel header="This is panel header 2" key="2">
          <p>{text}</p>
        </Panel>
        <Panel header="This is panel header 3" key="3">
          <p>{text}</p>
        </Panel>
      </Collapse>
    </>
  )
}

NodeTypeInput.displayName = 'NodeTypeInput'
