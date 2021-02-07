import React from 'react'
import { ICoordinateType, IPointType } from '../../types'
import { Port } from './Port'


export interface DiagramNodePortsProps {
  inputs: IPointType[];
  nodeId: string;
  type: 'input' | 'output';
  registerPort: (id: string, dom: HTMLElement) => void;
  onDragNewSegment: (id: string, from: ICoordinateType, to: ICoordinateType) => void;
  onSegmentFail: (id: string, type: string) => void;
  onSegmentConnect: (id: string, targetPort: string) => void;
}

export const DiagramNodePorts: React.FC<DiagramNodePortsProps> = (props) => {
  const {inputs, registerPort, onDragNewSegment, onSegmentFail, onSegmentConnect, nodeId, type} = props
  return (
    <>
      {
        inputs.map((port) => <Port
          onMount={registerPort}
          onDragNewSegment={onDragNewSegment}
          onSegmentFail={onSegmentFail}
          onSegmentConnect={onSegmentConnect}
          type={type}
          key={port.id}
          id={port.id}
          isLinked={port.isLinked}
          nodeId={nodeId}
        />)
      }
    </>
  )
}

DiagramNodePorts.displayName = 'DiagramNodePorts'
