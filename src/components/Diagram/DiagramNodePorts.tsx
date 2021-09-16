import React from 'react'
import { IPointType } from '../../types'
import { Port } from './Port'

export interface DiagramNodePortsProps {
  inputs: IPointType[]
  nodeId: string
  type: 'input' | 'output'
}

export const DiagramNodePorts: React.FC<DiagramNodePortsProps> = (props) => {
  const { inputs, nodeId, type } = props
  return (
    <>
      {inputs.map((port, index) => (
        <Port type={type} key={port.id} id={port.id} index={index} isLinked={port.isLinked} nodeId={nodeId} />
      ))}
    </>
  )
}

DiagramNodePorts.displayName = 'DiagramNodePorts'
