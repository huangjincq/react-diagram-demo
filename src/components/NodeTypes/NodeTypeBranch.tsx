import React from 'react'
import { Input } from 'antd'
import './style.scss'
import { INodeItemProps } from '../../types'
import { NodeTypeHeader } from './NodeTypeHeader'
import { nodesConfig } from './config'
import { Port } from '../Diagram/Port'

export interface NodeTypeBranchProps extends INodeItemProps<any> {}

export const NodeTypeBranch: React.FC<NodeTypeBranchProps> = (props) => {
  const { value, onChange, inputs, outputs } = props

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
      <NodeTypeHeader icon={nodesConfig.NodeTypeBranch.icon} label={nodesConfig.NodeTypeBranch.label} />
      <div className="node-content">
        {value.branchList.map((item: any, index: number) => (
          <div className="branch-input" key={index}>
            <Input placeholder="Input message here" value={item.text} data-index={index} onChange={handleInputChange} />
            {/* <Port
              onPortMount={onPortMount}
              onDragNewSegment={onDragNewSegment}
              onSegmentFail={onSegmentFail}
              onShowSelectModel={onShowSelectModel}
              onSegmentConnect={onSegmentConnect}
              type={type}
              key={port.id}
              id={port.id}
              index={index}
              isLinked={port.isLinked}
              nodeId={nodeId}
            /> */}
          </div>
        ))}
      </div>
    </>
  )
}

NodeTypeBranch.displayName = 'NodeTypeBranch'
