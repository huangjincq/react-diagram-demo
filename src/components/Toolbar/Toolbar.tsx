import React, { useCallback, useMemo } from 'react'
import { Button, Popover } from 'antd'

import './style.scss'
import eventBus, { EVENT_AUTO_LAYOUT } from '../../utils/eventBus'

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

  const handleAutoLayout = useCallback(() => {
    eventBus.emit(EVENT_AUTO_LAYOUT)
  }, [])

  return (
    <div className="toolbar">
      <Button disabled>{scale * 100}%</Button>
      <Button disabled={!canUndo} onClick={undo}>
        撤销
      </Button>
      <Button disabled={!canRedo} onClick={redo}>
        重做
      </Button>
      <Popover placement="right" content={scaleContent} overlayClassName="scale-popover">
        <Button>快捷键</Button>
      </Popover>
      <Button onClick={handleAutoLayout}>自动排列</Button>
    </div>
  )
})
