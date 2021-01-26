import React from 'react'
import { IPortRefs, INodeRefs } from '../../types'

export interface DiagramManager {
  canvas: HTMLDivElement | null;
  ports: IPortRefs;
  nodes: INodeRefs;
  scale: number
}

const defaultValue: DiagramManager = {canvas: null, ports: {}, nodes: {}, scale: 1}

export default React.createContext(defaultValue)
