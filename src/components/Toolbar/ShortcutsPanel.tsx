import React from 'react'

import './style.scss'
import IconClick from '../../static/icon-click.png'
import IconMove from '../../static/icon-move.png'
import IconWheel from '../../static/icon-wheel.png'
import { isMac } from '../../utils'

export interface ShortcutsPanelProps {}

const CTRL_OR_CMD = isMac ? 'CMD' : 'Ctrl'
// const ALT_OR_OPT = isMac ? 'OPT' : 'Alt'

const hotkeyList = [
  { text: '撤销', hotKeys: [{ key: CTRL_OR_CMD }, { key: 'Z' }] },
  { text: '多选', hotKeys: [{ key: 'Shift' }, { icon: IconClick }] },
  { text: '重做', hotKeys: [{ key: CTRL_OR_CMD }, { key: 'Shift' }, { key: 'Z' }] },
  { text: '全选', hotKeys: [{ key: CTRL_OR_CMD }, { key: 'A' }] },
  { text: '复制', hotKeys: [{ key: CTRL_OR_CMD }, { key: 'C' }] },
  { text: '缩放', hotKeys: [{ key: CTRL_OR_CMD }, { icon: IconWheel }] },
  { text: '粘贴', hotKeys: [{ key: CTRL_OR_CMD }, { key: 'V' }] },
  { text: '移动画布', hotKeys: [{ key: 'Space' }, { icon: IconMove }] },
  { text: '删除', hotKeys: [{ key: 'Del' }] },
  // { text: '自动排列', hotKeys: [{ key: CTRL_OR_CMD }, { key: 'Shift' }, { key: 'A' }] },
]

export const ShortcutsPanel: React.FC<ShortcutsPanelProps> = React.memo(() => {
  return (
    <ul className="shortcuts-panel">
      {hotkeyList.map((item, index) => (
        <li key={index} className="shortcuts-panel-item">
          <div className="shortcuts-panel-title">{item.text} :</div>
          <div className="shortcuts-panel-list">
            {item.hotKeys.map((keyItem, keyIndex) => (
              <React.Fragment key={keyIndex}>
                {keyIndex > 0 && <span className="shortcuts-panel-plus">+</span>}
                <div className="shortcuts-panel-key">
                  {keyItem.key}
                  {keyItem.icon && <img className="shortcuts-panel-icon" src={keyItem.icon} alt={item.text} />}
                </div>
              </React.Fragment>
            ))}
          </div>
        </li>
      ))}
    </ul>
  )
})
