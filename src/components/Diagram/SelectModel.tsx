import React, { useEffect, useMemo, useRef } from 'react'
import ReactDOM from 'react-dom'
import { ICoordinateType } from '../../types'

export interface SelectModelProps {
  position?: ICoordinateType
}

export const SelectModel: React.FC<SelectModelProps> = React.memo((prop) => {
  const { position } = prop

  if (!position) {
    return null
  }

  return ReactDOM.createPortal(
    <div className="select-model">
      <ul className="select-model-content" style={{ left: position[0], top: position[1], position: 'absolute' }}>
        <li>34234234</li>
        <li>34234234</li>
        <li>34234234</li>
      </ul>
    </div>,
    document.body
  )
})

SelectModel.displayName = 'SelectModel'
