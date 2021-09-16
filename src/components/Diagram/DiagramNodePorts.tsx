import classnames from 'classnames'
import React from 'react'
import { IPointType } from '../../types'
import { Port } from './Port'

export interface DiagramNodePortsProps {
  ports: IPointType[]
  nodeId: string
  type: 'input' | 'output'
}

export const DiagramNodePorts: React.FC<DiagramNodePortsProps> = (props) => {
  const { ports: inputs, nodeId, type } = props

  const className = classnames('diagram-port-wrapper', {
    'type-input': type === 'input',
    'type-output': type === 'output',
  })
  return (
    <>
      <div className={className}>
        {inputs.map((port) => (
          <Port key={port.id} id={port.id} isLinked={port.isLinked} nodeId={nodeId} />
        ))}
      </div>
    </>
  )
}

DiagramNodePorts.displayName = 'DiagramNodePorts'
