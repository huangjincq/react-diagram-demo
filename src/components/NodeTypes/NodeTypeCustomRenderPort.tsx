import React from 'react'
import { Input } from 'antd'
import './style.scss'
import { INodeItemProps } from '../../types'
import { NodeTypeHeader } from './NodeTypeHeader'
import { nodesConfig } from './config'
import { Port } from '../Diagram/Port'

export interface NodeTypeCustomRenderPortProps extends INodeItemProps<any> {}

export const NodeTypeCustomRenderPort: React.FC<NodeTypeCustomRenderPortProps> = (props) => {
  const { value, onChange, outputs, nodeId } = props

  const handleInputChange = (e: any) => {
    const index = e.target.dataset.index
    const newBranchList = [...value.branchList]
    newBranchList[index].text = e.target.value
    onChange({
      ...value,
      branchList: newBranchList,
    })
  }

  return (
    <>
      <NodeTypeHeader
        icon={nodesConfig.nodeTypeCustomRenderPort.icon}
        label={nodesConfig.nodeTypeCustomRenderPort.label}
      />
      <div className="node-content">
        {value.branchList.map((item: any, index: number) => (
          <div className="branch-input" key={index}>
            <Input placeholder="Input message here" value={item.text} data-index={index} onChange={handleInputChange} />
            {outputs && <Port id={outputs[index].id} isLinked={outputs[index].isLinked} nodeId={nodeId} />}
          </div>
        ))}
      </div>
    </>
  )
}

NodeTypeCustomRenderPort.displayName = 'NodeTypeCustomRenderPort'
