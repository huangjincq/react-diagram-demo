import React from 'react'
import { Button } from 'antd'

// import { DeleteOutlined } from '@ant-design/icons'


export interface DiagramNodeActionButtonsProps {
  onNodeCopy: (index: number) => void
  // onNodeDelete: () => void
}

export const DiagramNodeActionButtons: React.FC<DiagramNodeActionButtonsProps> = (props) => {
  const {onNodeCopy} = props
  return (
    <div>
      <Button>复制</Button>
      {/*<Button onClick={onNodeDelete}>删除</Button>*/}
    </div>
  )
}

DiagramNodeActionButtons.displayName = 'DiagramNodeActionButtons'
