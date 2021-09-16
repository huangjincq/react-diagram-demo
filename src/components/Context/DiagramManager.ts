import { createContext, useContext } from 'react'
import { IPortRefs, INodeRefs } from '../../types'

export interface IDiagramManager {
  canvasRef: HTMLDivElement | null
  portRefs: IPortRefs
  nodeRefs: INodeRefs
  scale: number
}

const defaultValue: IDiagramManager = { canvasRef: null, portRefs: {}, nodeRefs: {}, scale: 1 }

const DiagramManagerContext = createContext(defaultValue)

export const DiagramManagerProvider = DiagramManagerContext.Provider

// export DiagramManager Context
export const useDiagramManager = (): IDiagramManager => {
  return useContext(DiagramManagerContext)
}

// export DiagramCanvas Context
export const useDiagramCanvas = (): HTMLDivElement | null => {
  const { canvasRef } = useContext(DiagramManagerContext)
  return canvasRef
}

// return  DiagramNod dom 节点
export const useDiagramNodeRefs = (): INodeRefs => {
  const { nodeRefs } = useContext(DiagramManagerContext)
  return nodeRefs
}

// return  DiagramNodePorts ports 节点
export const usePortRefs = (): IPortRefs => {
  const { portRefs } = useContext(DiagramManagerContext)
  return portRefs
}

// return scale
export const useScale = (): number => {
  const { scale } = useContext(DiagramManagerContext)
  return scale
}
