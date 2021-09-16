import { createContext, useContext } from 'react'
import { ICoordinateType } from '../../types'

export interface IPortManager {
  onDragNewSegment: (id: string, from: ICoordinateType, to: ICoordinateType) => void
  onSegmentFail: (id: string) => void
  onSegmentConnect: (id: string, targetPort: string) => void
  onShowSelectModel: (event: MouseEvent, input: string) => void
  onPortMount: (id: string, dom: HTMLElement) => void
}

const defaultValue: IPortManager = {
  onDragNewSegment: (id, from, to) => {},
  onSegmentFail: (id) => {},
  onSegmentConnect: (id, targetPort) => {},
  onShowSelectModel: (event, input) => {},
  onPortMount: (id, dom) => {},
}

const PortManagerContext = createContext(defaultValue)

export const PortManagerContextProvider = PortManagerContext.Provider

export const usePortManager = (): IPortManager => {
  return useContext(PortManagerContext)
}
