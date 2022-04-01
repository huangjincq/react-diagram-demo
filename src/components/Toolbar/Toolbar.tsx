import React, { useCallback } from 'react'
import { Button, Popover } from 'antd'

import './style.scss'
import eventBus, { EVENT_AUTO_LAYOUT } from '../../utils/eventBus'
import { ShortcutsPanel } from './ShortcutsPanel'

export interface ToolbarProps {
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
  scale: number
}

export const Toolbar: React.FC<ToolbarProps> = React.memo(({ undo, redo, canUndo, canRedo, scale }) => {
  const handleAutoLayout = useCallback(() => {
    eventBus.emit(EVENT_AUTO_LAYOUT)
  }, [])

  return (
    <div className="toolbar">
      <Button disabled>{(scale * 100).toFixed(0)}%</Button>
      <Button disabled={!canUndo} onClick={undo}>
        撤销
      </Button>
      <Button disabled={!canRedo} onClick={redo}>
        重做
      </Button>
      <Popover trigger="click" placement="right" content={<ShortcutsPanel />} overlayClassName="scale-popover">
        <Button>快捷键</Button>
      </Popover>
      <Button onClick={handleAutoLayout}>自动排列</Button>
    </div>
  )
})
