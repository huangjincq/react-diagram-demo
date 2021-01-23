import React from 'react'
import { IPortRefs, INodeRefs } from '../../types'

export interface DiagramManager {
  canvas: HTMLDivElement | null;
  ports: IPortRefs;
  nodes: INodeRefs;
}

const defaultValue: DiagramManager = {canvas: null, ports: {}, nodes: {}}

export default React.createContext(defaultValue)
