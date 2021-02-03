import React from 'react'
import { IPointType } from '../../../types'
import { Port } from '../Port'


export interface InputPortsProps {
  inputs: IPointType[];
  registerPort: any;
  onDragNewSegment: any;
  onSegmentFail: any;
  onSegmentConnect: any;
}

export const InputPorts: React.FC<InputPortsProps> = (props) => {
  const {inputs, registerPort, onDragNewSegment, onSegmentFail, onSegmentConnect} = props
  return (
    <div className="bi-input-ports">
      {
        inputs.map((port) => <Port
          {...port}
          onMount={registerPort}
          onDragNewSegment={onDragNewSegment}
          onSegmentFail={onSegmentFail}
          onSegmentConnect={onSegmentConnect}
          type='input'
          key={port.id}
        />)
      }
    </div>
  )
}

InputPorts.displayName = 'InputPorts'
