import React, {useMemo, useState} from 'react'
import {Button, Popover} from "antd";

import "./style.scss"

export interface ToolbarProps {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean
  scale: number;
  setScale: React.Dispatch<React.SetStateAction<number>>;
}

const scaleList = [
  {text: '100%', value: 1},
  {text: '80%', value: 0.8},
  {text: '50%', value: 0.5},
  {text: '20%', value: 0.2},
]


export const Toolbar: React.FC<ToolbarProps> = ({undo, redo, canUndo, canRedo, scale, setScale}) => {
  const [visible, setVisible] = useState<boolean>(false)


  const displayScale = useMemo(() => {
    return scaleList.find(item => item.value === scale)?.text || ''
  }, [scale])

  const scaleContent = useMemo(() => {
    return (<div>
      {scaleList.map(item => <div onClick={() => {
        setScale(item.value)
        setVisible(false)
      }} key={item.value} className='scale-item'>{item.text}</div>)}
    </div>)
  }, [setScale, setVisible])

  return (
    <div className="toolbar">
      <Button disabled={!canUndo} onClick={undo}>撤销</Button>
      <Button disabled={!canRedo} onClick={redo}>重做</Button>
      <Popover
        visible={visible} placement="right" content={scaleContent} trigger="click"
        onVisibleChange={(visible) => {
          setVisible(visible)
        }}
        overlayClassName='scale-popover'>
        <Button>{displayScale}</Button>
      </Popover>
    </div>
  )
}
