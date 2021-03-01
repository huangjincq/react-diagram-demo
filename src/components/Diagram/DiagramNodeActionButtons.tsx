import React, { useCallback } from 'react'
import { Button } from 'antd'
import { DeleteOutlined, CopyOutlined } from '@ant-design/icons'


// import { DeleteOutlined } from '@ant-design/icons'


export interface DiagramNodeActionButtonsProps {
  id: string
  onNodeCopy: (nodeId: string) => void
  onNodeDelete: (nodeId: string) => void
}

export const DiagramNodeActionButtons: React.FC<DiagramNodeActionButtonsProps> = (props) => {
  const {onNodeDelete, onNodeCopy, id} = props

  const handleNodeDelete = useCallback(() => {
    onNodeDelete(id)
  }, [id, onNodeDelete])

  const handleNodeCopy = useCallback(() => {
    onNodeCopy(id)
  }, [id, onNodeCopy])

  return (
    <div className='diagram-node-action'>
      <Button onClick={handleNodeCopy} icon={<CopyOutlined/>}/>
      <Button onClick={handleNodeDelete} icon={<DeleteOutlined/>}/>
    </div>
  )
}

DiagramNodeActionButtons.displayName = 'DiagramNodeActionButtons'
