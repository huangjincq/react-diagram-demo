import React, { useCallback } from 'react'
import { Button } from 'antd'

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
    <div>
      <Button onClick={handleNodeCopy}>复制</Button>
      <Button onClick={handleNodeDelete}>删除</Button>
    </div>
  )
}

DiagramNodeActionButtons.displayName = 'DiagramNodeActionButtons'
