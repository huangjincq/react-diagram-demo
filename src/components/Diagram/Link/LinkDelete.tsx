import React from 'react';
import {ICoordinateType} from "../../../types";

interface LinkDeleteProps {
  position: ICoordinateType
}


export const LinkDelete: React.FC<LinkDeleteProps> = React.memo(({position,}) => (
  <foreignObject x={position[0]} y={position[1]}>
    <div className="bi-diagram-link-label">
      label
    </div>
  </foreignObject>
))

LinkDelete.displayName = 'LinkDelete'
