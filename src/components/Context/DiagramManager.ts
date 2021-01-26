import { createContext, useContext } from 'react'
import { IPortRefs, INodeRefs } from '../../types'

export interface DiagramManager {
  canvasRef: HTMLDivElement | null;
  portRefs: IPortRefs;
  nodeRefs: INodeRefs;
  scale: number
}

const defaultValue: DiagramManager = {canvasRef: null, portRefs: {}, nodeRefs: {}, scale: 1}

const DiagramManagerContext = createContext(defaultValue)

export const DiagramManagerProvider = DiagramManagerContext.Provider

// export DiagramManager Context
export const useDiagramManager = (): DiagramManager => {
  return useContext(DiagramManagerContext)
}

// export DiagramCanvas Context
export const useDiagramCanvas = (): HTMLDivElement | null => {
  const {canvasRef} = useContext(DiagramManagerContext)
  return canvasRef
}

// return  DiagramNode dom 节点
export const useDiagramNodeRefs = (): IPortRefs => {
  const {nodeRefs} = useContext(DiagramManagerContext)
  return nodeRefs
}

// return  DiagramNode ports 节点
export const usePortRefs = (): INodeRefs => {
  const {portRefs} = useContext(DiagramManagerContext)
  return portRefs
}

// return  DiagramNode ports 节点
export const useScale = (): number => {
  const {scale} = useContext(DiagramManagerContext)
  return scale
}
