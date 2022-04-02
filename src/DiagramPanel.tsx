import React, { useCallback, useMemo, useRef, useState, memo } from 'react'
import { Diagram } from './components/Diagram'
import { useHistory } from './hooks/useHistory'
import { Toolbar } from './components/Toolbar/Toolbar'
import { NodeList } from './components/NodeList/NodeList'
import { IDiagramType, ICoordinateType, IMousePosition, ITransform, ISelectionArea } from './types'
import { createNode } from './components/NodeTypes/config'
import { throttle } from 'lodash-es'
import {
  calculatingCoordinates,
  checkIsFocusInPanel,
  checkMouseDownTargetIsDrawPanel,
  checkWheelDirection,
  collideCheck,
  computedWheelDelta,
  isTriggerScale,
  oneNodeDelete,
} from './utils'
import { useHotkeys } from 'react-hotkeys-hook'
import useEventCallback from './hooks/useEventCallback'
import useEventListener from './hooks/useEventListener'
import { HOT_KEY_DEL, HOT_KEY_REDO, HOT_KEY_SELECT_ALL, HOT_KEY_SPACE, HOT_KEY_UNDO } from './constant/hotKeys'
import { CURSOR_MAP, DRAG_STATE, SCALE_STEP } from './constant'
import { defaultValue } from './utils/creatMockData'
import { calculatePasteOriginCoordination, createCopyValue, createPasteValue } from './utils/copyPaste'
import hotkeys from 'hotkeys-js'

// import { useThrottleFn } from 'react-use'

function DiagramPanel() {
  const {
    present,
    set,
    setWithHistory,
    addAHistory,
    undo: handleUndo,
    redo: handleRedo,
    canUndo,
    canRedo,
  } = useHistory(defaultValue)

  const value = present as IDiagramType
  const [transform, setTransform] = useState<ITransform>({
    scale: 1,
    translateX: 0,
    translateY: 0,
  })
  const [selectionArea, setSelectionArea] = useState<ISelectionArea | undefined>()
  const [dragState, setDragState] = useState<string>(DRAG_STATE.DEFAULT)
  const mouseDownStartPosition = useRef<IMousePosition | undefined>()
  const [activeNodeIds, setActiveNodeIds] = useState<string[]>([])

  const panelRef = useRef<HTMLDivElement>(null)
  const selectionAreaRef = useRef<HTMLDivElement>(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const panelRect = useMemo(() => panelRef.current?.getBoundingClientRect() || { x: 0, y: 0 }, [panelRef.current])

  // eslint-disable-next-line
  const handleThrottleSetTransform = useCallback(
    throttle((transform) => {
      setTransform(transform)
    }, 20),
    [setTransform]
  )

  const handleChange = useCallback(
    (newValue: IDiagramType, notAddHistory?: boolean) => {
      if (notAddHistory) {
        set(newValue)
      } else {
        setWithHistory(newValue)
      }
    },
    [set, setWithHistory]
  )

  const handleAddHistory = useCallback(
    (newValue: IDiagramType) => {
      addAHistory(newValue)
    },
    [addAHistory]
  )

  const handleDrop = useCallback(
    (event: any) => {
      if (event) {
        event = window.event
      }
      const nodeType = event.dataTransfer.getData('nodeType')

      const coordinates: ICoordinateType = calculatingCoordinates(
        event,
        document.getElementById('diagram-canvas'),
        transform.scale
      )

      const newNode = createNode(nodeType, coordinates)
      handleChange({ ...value, nodes: [...value.nodes, newNode] })
    },
    [handleChange, transform, value]
  )

  const handleDrag = useCallback((e: any) => {
    e.preventDefault()
  }, [])

  // 控制滚轮缩放
  const handlePanelScale = useEventCallback((event: WheelEvent) => {
    const { wheelDown, wheelUp } = checkWheelDirection(event)

    let { scale, translateX, translateY } = transform

    const offsetX = ((event.clientX - panelRect.x - translateX) * SCALE_STEP) / scale
    const offsetY = ((event.clientY - panelRect.y - translateY) * SCALE_STEP) / scale

    if (wheelDown) {
      scale = scale - SCALE_STEP
      translateX = translateX + offsetX
      translateY = translateY + offsetY
    }
    if (wheelUp) {
      scale = scale + SCALE_STEP
      translateX = translateX - offsetX
      translateY = translateY - offsetY
    }

    if (scale > 1 || scale < 0.1) return

    setTransform({
      scale: Number(scale.toFixed(2)),
      translateX,
      translateY,
    })
  })

  // 控制滚轮移动画布
  const handlePanelTranslate = useEventCallback((event: WheelEvent) => {
    const { deltaY, deltaX } = computedWheelDelta(event)
    const { translateX, translateY } = transform

    setTransform({
      ...transform,
      translateX: translateX - deltaX,
      translateY: translateY - deltaY,
    })
  })

  const handleWheel = useEventCallback((event: WheelEvent) => {
    if (panelRef.current?.contains(event.target as Node)) {
      event.preventDefault()
      event.returnValue = false
      if (isTriggerScale(event)) {
        handlePanelScale(event)
      } else {
        handlePanelTranslate(event)
      }
    }
  })

  const handleMouseDown = useEventCallback((event) => {
    mouseDownStartPosition.current = {
      x: event.clientX,
      y: event.clientY,
      relativeX: event.clientX - transform.translateX,
      relativeY: event.clientY - transform.translateY,
    }
    if (checkMouseDownTargetIsDrawPanel(event, panelRef.current)) {
      if (dragState === DRAG_STATE.START) {
        setDragState(DRAG_STATE.MOVE)
      } else {
        setDragState(DRAG_STATE.SELECTION)
        setActiveNodeIds([])
      }
    }
  })

  // eslint-disable-next-line
  const handleThrottleSetSelectionArea = useCallback(
    throttle((e) => {
      if (mouseDownStartPosition.current && panelRef.current) {
        // const panelRect = panelRef.current.getBoundingClientRect()
        setSelectionArea({
          left: Math.min(e.clientX, mouseDownStartPosition.current.x) - panelRect.x,
          top: Math.min(e.clientY, mouseDownStartPosition.current.y) - panelRect.y,
          width: Math.abs(e.clientX - mouseDownStartPosition.current.x),
          height: Math.abs(e.clientY - mouseDownStartPosition.current.y),
        })
        const selectAreaDom = selectionAreaRef.current
        const activeNodeIds = value.nodes
          .map((v) => v.id)
          .filter((id) => {
            return collideCheck(selectAreaDom, document.getElementById(id))
          })

        setActiveNodeIds(activeNodeIds)
      }
    }, 20),
    [transform, value]
  )

  const handleMouseUp = useEventCallback((event) => {
    if (dragState === DRAG_STATE.MOVE) {
      setDragState(DRAG_STATE.START)
    } else {
      setDragState(DRAG_STATE.DEFAULT)
    }
    setSelectionArea(undefined)
    mouseDownStartPosition.current = undefined
  })

  const handleMouseMove = useEventCallback((event) => {
    if (dragState === DRAG_STATE.MOVE && mouseDownStartPosition.current) {
      handleThrottleSetTransform({
        ...transform,
        translateX: event.clientX - mouseDownStartPosition.current.relativeX,
        translateY: event.clientY - mouseDownStartPosition.current.relativeY,
      })
    }

    if (dragState === DRAG_STATE.SELECTION) {
      handleThrottleSetSelectionArea(event)
    }
  })

  const handleSpaceHotKey = useEventCallback((event: KeyboardEvent) => {
    if (hotkeys.isPressed(HOT_KEY_SPACE)) {
      if (event.type === 'keydown' && dragState === DRAG_STATE.DEFAULT) {
        setDragState(DRAG_STATE.START)
      }
      if (event.type === 'keyup') {
        setDragState(DRAG_STATE.DEFAULT)
      }
    }
  })

  const handleSelectAll = useEventCallback((event: KeyboardEvent) => {
    if (checkIsFocusInPanel(panelRef.current)) {
      event.preventDefault()
      setActiveNodeIds(value.nodes.map((node) => node.id))
    }
  })

  const handleBatchDelete = useEventCallback(() => {
    if (checkIsFocusInPanel(panelRef.current) && activeNodeIds.length) {
      let nextValue = { ...value }
      activeNodeIds.forEach((nodeId) => {
        nextValue = oneNodeDelete(nextValue, nodeId)
      })
      handleChange(nextValue)
    }
  })

  const handleBatchCopy = useEventCallback((event: React.ClipboardEvent) => {
    if (checkIsFocusInPanel(panelRef.current) && activeNodeIds.length) {
      event.preventDefault()
      // activeNodeIds
      const originCopyData = createCopyValue(value, activeNodeIds)

      event.clipboardData.setData('text/json', JSON.stringify(originCopyData))
    }
  })

  const handleBatchPaste = useEventCallback((event: React.ClipboardEvent) => {
    if (checkIsFocusInPanel(panelRef.current)) {
      event.preventDefault()
      // 计算 node 粘贴的偏移量
      const pasteOffset = panelRef.current
        ? calculatePasteOriginCoordination(transform, panelRef.current)
        : { x: 20, y: 20 }

      const pasteString = event.clipboardData.getData('text/json')
      if (pasteString) {
        const newValue = createPasteValue(JSON.parse(pasteString), pasteOffset)

        handleChange({ links: [...value.links, ...newValue.links], nodes: [...value.nodes, ...newValue.nodes] })
      }
    }
  })

  const handleToggleActiveNodeId = useEventCallback((nodeId: string) => {
    let nextActiveNodeIds = [...activeNodeIds]
    const findIndex = nextActiveNodeIds.findIndex((activeNodeId) => activeNodeId === nodeId)
    if (findIndex > -1) {
      nextActiveNodeIds.splice(findIndex, 1)
    } else {
      nextActiveNodeIds = [...nextActiveNodeIds, nodeId]
    }
    setActiveNodeIds(nextActiveNodeIds)
  })

  const cursor = useMemo(() => {
    return CURSOR_MAP[dragState]
  }, [dragState])

  const hideSelectionArea = useMemo(() => dragState !== DRAG_STATE.SELECTION, [dragState])

  const selectionAreaStyled = useMemo(
    () => ({
      left: selectionArea?.left,
      top: selectionArea?.top,
      width: selectionArea?.width,
      height: selectionArea?.height,
    }),
    [selectionArea]
  )

  /*
   * bind some hotkeys
   */
  useHotkeys(HOT_KEY_UNDO, handleUndo, {}, [handleUndo])
  useHotkeys(HOT_KEY_REDO, handleRedo, {}, [handleRedo])
  useHotkeys(HOT_KEY_SELECT_ALL, handleSelectAll, {}, [handleSelectAll])
  useHotkeys(HOT_KEY_DEL, handleBatchDelete, {}, [handleBatchDelete])
  // hotkeys-js 直接使用 'space' mac 空格有兼容问题
  useHotkeys('*', handleSpaceHotKey, { keyup: true, keydown: true }, [handleSpaceHotKey])

  useEventListener('wheel', handleWheel, null, { passive: false })

  useEventListener('mouseup', handleMouseUp)
  useEventListener('mousemove', handleMouseMove)
  useEventListener('mousedown', handleMouseDown)

  useEventListener('copy', handleBatchCopy)
  useEventListener('paste', handleBatchPaste)

  return (
    <>
      <div
        id="diagram-panel"
        ref={panelRef}
        className="diagram-panel"
        onDrop={handleDrop}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        tabIndex={1}
        style={{ cursor }}
      >
        <Diagram
          value={value}
          transform={transform}
          onChange={handleChange}
          onAddHistory={handleAddHistory}
          activeNodeIds={activeNodeIds}
          onToggleActiveNodeId={handleToggleActiveNodeId}
        />
        <div
          ref={selectionAreaRef}
          className="diagram-selection-area"
          hidden={hideSelectionArea}
          style={selectionAreaStyled}
        />
      </div>
      <Toolbar undo={handleUndo} redo={handleRedo} canUndo={canUndo} scale={transform.scale} canRedo={canRedo} />
      <NodeList />
    </>
  )
}

export default memo(DiagramPanel)
