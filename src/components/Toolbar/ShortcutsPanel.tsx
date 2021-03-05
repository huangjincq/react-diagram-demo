import React, { useCallback, useMemo } from 'react'
import { Button, Popover } from 'antd'

import './style.scss'

export interface ShortcutsPanelProps {}

const isMac = (() => /macintosh|mac os x/i.test(navigator.userAgent))()

const CTRL_OR_CMD = isMac ? 'CMD' : 'Ctrl'
const ALT_OR_OPT = isMac ? 'OPT' : 'Alt'

const hotkeyList = [
  { text: '撤销', hotKeys: [{ key: CTRL_OR_CMD }, { key: 'Z' }] },
  { text: '重做', hotKeys: [{ key: CTRL_OR_CMD }, { key: 'Shift' }, { key: 'Z' }] },
  { text: '缩放', hotKeys: [{ icon: 'a' }] },
  { text: '复制', hotKeys: [{ key: CTRL_OR_CMD }, { key: 'C' }] },
  { text: '粘贴', hotKeys: [{ key: CTRL_OR_CMD }, { key: 'V' }] },
  { text: '全选', hotKeys: [{ key: CTRL_OR_CMD }, { key: 'A' }] },
  { text: '自动排列', hotKeys: [{ key: CTRL_OR_CMD }, { key: 'Shift' }, { key: 'A' }] },
  { text: '删除', hotKeys: [{ key: 'Del' }] },
  { text: '多选', hotKeys: [{ key: 'Shift' }, { icon: '2' }] },
  { text: '移动画布', hotKeys: [{ key: 'Space' }, { icon: '2' }] },
]

export const ShortcutsPanel: React.FC<ShortcutsPanelProps> = React.memo(({}) => {
  return (
    <div>
      {hotkeyList.map((item, index) => (
        <div key={index} className="scale-item">
          {item.text}
        </div>
      ))}
    </div>
  )
})
