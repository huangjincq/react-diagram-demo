import React, { useMemo } from 'react'
import { Button, Popover } from 'antd'

import './style.scss'

export interface ToolbarProps {
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
  scale: number
}

const scaleList = [
  { text: '滚轮放大缩小', value: 1 },
  { text: '空格 + 鼠标拖动', value: 2 },
]

export const Toolbar: React.FC<ToolbarProps> = React.memo(({ undo, redo, canUndo, canRedo, scale }) => {
  const scaleContent = useMemo(() => {
    return (
      <div>
        {scaleList.map((item) => (
          <div key={item.value} className="scale-item">
            {item.text}
          </div>
        ))}
      </div>
    )
  }, [])

  return (
    <div className="toolbar">
      <Button disabled={!canUndo} onClick={undo}>
        撤销
      </Button>
      <Button disabled={!canRedo} onClick={redo}>
        重做
      </Button>
      <Popover placement="right" content={scaleContent} overlayClassName="scale-popover">
        <Button>快捷键</Button>
      </Popover>
      <Button>{scale * 100}%</Button>
    </div>
  )
})
