import React from 'react'
import ReactDOM from 'react-dom'
import { ICoordinateType, NodeTypeEnum } from '../../types'
import { nodesList } from '../NodeTypes/config'

export interface SelectModelProps {
  position?: ICoordinateType
  onChange: (nodeType?: NodeTypeEnum) => void
}

export const SelectModel: React.FC<SelectModelProps> = React.memo((prop) => {
  const { position, onChange } = prop

  if (!position) {
    return null
  }

  const handleClose = () => {
    onChange()
  }

  const handleItemClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    onChange(event.currentTarget.dataset.type as NodeTypeEnum)
  }
  const stopEvent = (event: React.MouseEvent<HTMLUListElement, MouseEvent>) => {
    event.stopPropagation()
  }

  return ReactDOM.createPortal(
    <div className="select-model" onClick={handleClose}>
      <ul
        className="select-model-content"
        style={{ left: position[0], top: position[1], position: 'absolute' }}
        onClick={stopEvent}
      >
        {nodesList.map((node) => (
          <li key={node.type} className="select-model-item" onClick={handleItemClick} data-type={node.type}>
            {node.icon && React.createElement(node.icon)}
            <div className="select-model-text">{node.label}</div>
          </li>
        ))}
      </ul>
    </div>,
    document.body
  )
})

SelectModel.displayName = 'SelectModel'
