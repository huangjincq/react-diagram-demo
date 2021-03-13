import { isEqual } from 'lodash-es'
import React, { useCallback, useRef } from 'react'
import useEventBus from '../../hooks/useEventBus'
import { ICoordinateType } from '../../types'
import { EVENT_NODE_MOVE_END, EVENT_NODE_MOVING } from '../../utils/eventBus'

export interface MarkLineProps {
  onNodePositionChange: (id: string, nextCoords: ICoordinateType) => void
}

const getNodeStyle = (nodeDom: any) => {
  const dom = nodeDom as HTMLElement
  const width = dom.offsetWidth
  const height = dom.offsetHeight
  return {
    width,
    height,
    left: dom.offsetLeft,
    top: dom.offsetTop,
    right: dom.offsetLeft + width,
    bottom: dom.offsetTop + height,
  }
}

const DIFF = 3
const isNearly = (dragValue: number, targetValue: number) => Math.abs(dragValue - targetValue) <= DIFF

export const MarkLine: React.FC<MarkLineProps> = React.memo(({ onNodePositionChange }) => {
  const ref = useRef<HTMLDivElement>(null)

  const handleHideLine = useCallback(() => {
    if (ref.current) {
      ref.current.childNodes.forEach((markLine) => {
        const line = markLine as HTMLElement
        if (line.style.visibility === 'visible') {
          line.style.visibility = 'hidden'
        }
      })
    }
  }, [ref])

  const handleMove = useCallback(
    (nodeId: string, coordinates: ICoordinateType) => {
      handleHideLine()

      const curNodeDom = document.getElementById(nodeId)
      if (!curNodeDom) return

      const curNodeStyle = getNodeStyle(curNodeDom)

      const nodes = Array.from(document.querySelectorAll('.diagram-node'))
      nodes.forEach((node) => {
        if (nodeId !== node.id) {
          const nodeStyle = getNodeStyle(node)
          const { top, left, bottom, right } = nodeStyle
          const conditions: any = {
            top: [
              {
                isNearly: isNearly(curNodeStyle.top, top),
                lineNode: ref.current?.childNodes[0],
                line: 'x-top',
                dragShift: top,
                lineShift: top,
              },
              {
                isNearly: isNearly(curNodeStyle.bottom, top),
                lineNode: ref.current?.childNodes[0],
                line: 'x-top',
                dragShift: top - curNodeStyle.height,
                lineShift: top,
              },
              {
                isNearly: isNearly(curNodeStyle.top, bottom),
                lineNode: ref.current?.childNodes[1],
                line: 'x-bottom',
                dragShift: bottom,
                lineShift: bottom,
              },
              {
                isNearly: isNearly(curNodeStyle.bottom, bottom),
                lineNode: ref.current?.childNodes[1],
                line: 'x-bottom',
                dragShift: bottom - curNodeStyle.height,
                lineShift: bottom,
              },
            ],
            left: [
              {
                isNearly: isNearly(curNodeStyle.left, left),
                lineNode: ref.current?.childNodes[2],
                line: 'y-left',
                dragShift: left,
                lineShift: left,
              },
              {
                isNearly: isNearly(curNodeStyle.right, left),
                lineNode: ref.current?.childNodes[2],
                line: 'y-left',
                dragShift: left - curNodeStyle.width,
                lineShift: left,
              },
              {
                isNearly: isNearly(curNodeStyle.left, right),
                lineNode: ref.current?.childNodes[3],
                line: 'y-right',
                dragShift: right,
                lineShift: right,
              },
              {
                isNearly: isNearly(curNodeStyle.right, right),
                lineNode: ref.current?.childNodes[3],
                line: 'y-right',
                dragShift: right - curNodeStyle.width,
                lineShift: right,
              },
            ],
          }

          Object.keys(conditions).forEach((key: string) => {
            conditions[key].forEach((condition: any) => {
              if (condition.isNearly) {
                if (condition.lineNode) {
                  condition.lineNode.style[key] = `${condition.lineShift}px`
                  condition.lineNode.style.visibility = 'visible'
                }
                let newCoordinates: ICoordinateType = [...coordinates]
                if (key === 'top') {
                  newCoordinates = [coordinates[0], condition.dragShift]
                } else {
                  newCoordinates = [condition.dragShift, coordinates[1]]
                }

                if (!isEqual(newCoordinates, coordinates)) {
                  onNodePositionChange(nodeId, newCoordinates)
                }
              }
            })
          })
        }
      })
    },
    [handleHideLine, onNodePositionChange]
  )

  useEventBus({ type: EVENT_NODE_MOVING, onChange: handleMove })
  useEventBus({ type: EVENT_NODE_MOVE_END, onChange: handleHideLine })

  return (
    <div className="mark-line" ref={ref}>
      <div className="mark-line-item x-direction" data-mark-line-id="x-top" />
      <div className="mark-line-item x-direction" data-mark-line-id="x-bottom" />
      <div className="mark-line-item y-direction" data-mark-line-id="y-left" />
      <div className="mark-line-item y-direction" data-mark-line-id="y-right" />
    </div>
  )
})

MarkLine.displayName = 'MarkLine'
