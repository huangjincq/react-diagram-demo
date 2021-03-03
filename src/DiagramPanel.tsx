import React, { useCallback, useMemo, useRef, useState, memo } from 'react'
import { Diagram } from './components/Diagram'
import { useHistory } from './hooks/useHistory'
import { Toolbar } from './components/Toolbar/Toolbar'
import { NodeList } from './components/NodeList/NodeList'
import { IDiagramType, ICoordinateType, IMousePosition, ITransform, ISelectionArea } from './types'
import { createNode } from './components/NodeTypes/config'
import { throttle } from 'lodash-es'
import { calculatingCoordinates, checkMouseDownTargetIsDrawPanel, collideCheck } from './utils'
// import { useThrottleFn } from 'react-use'

const manyNode: any = new Array(3).fill({}).map((item, index) => {
  return {
    id: 'node-' + index,
    coordinates: [index * 40, index * 50],
    inputs: [],
    outputs: [{ id: 'port-' + index, isLinked: false }],
    type: 'nodeTypeInput',
    data: {
      inputValue: 'defaultValue',
    },
  }
})

const manyLink = new Array(2).fill({}).map((item, index) => {
  return { input: 'port-' + index, output: 'node-' + (index + 1) }
})

const defaultValue: IDiagramType = {
  nodes: manyNode,
  // nodes: [
  //   {
  //     id: 'node-1',
  //     coordinates: [100, 150],
  //     inputs: [],
  //     outputs: [{id: 'port-1', isLinked: true}],
  //     type: 'nodeTypeInput',
  //     data: {
  //       inputValue: 'defaultValue'
  //     }
  //   },
  //   {
  //     id: 'node-2',
  //     type: 'nodeTypeSelect',
  //     coordinates: [400, 200],
  //     inputs: [{id: 'input-1', isLinked: false}],
  //     outputs: [{id: 'port-5', isLinked: false}],
  //     data: {
  //       selectValue: ''
  //     }
  //   }
  // ],
  links: manyLink,
  // links: [{input: 'port-1', output: 'node-2'}]
}

const SCALE_STEP = 0.1

const DRAG_STATE = {
  DEFAULT: 'DEFAULT',
  START: 'START',
  MOVE: 'MOVE',
  END: 'END',
  SELECTION: 'SELECTION',
}

const CURSOR_MAP = {
  [DRAG_STATE.DEFAULT]: 'default',
  [DRAG_STATE.SELECTION]: 'default',
  [DRAG_STATE.START]: 'grab',
  [DRAG_STATE.MOVE]: 'grabbing',
}

function DiagramPanel() {
  const { value, set, setWithHistory, addAHistory, undo, redo, canUndo, canRedo } = useHistory(defaultValue)
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

  // eslint-disable-next-line
  const handleThrottleSetTransform = useCallback(
    throttle((transform) => {
      setTransform(transform)
    }, 20),
    []
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

  const handleWheel = useCallback(
    (event: any) => {
      const wheelDelta = event.nativeEvent.wheelDelta

      let { scale, translateX, translateY } = transform

      const offsetX = ((event.clientX - translateX) * SCALE_STEP) / scale
      const offsetY = ((event.clientY - translateY) * SCALE_STEP) / scale

      if (wheelDelta < 0) {
        scale = scale - SCALE_STEP
        translateX = translateX + offsetX
        translateY = translateY + offsetY
      }
      if (wheelDelta > 0) {
        scale = scale + SCALE_STEP
        translateX = translateX - offsetX
        translateY = translateY - offsetY
      }

      if (scale > 1 || scale < 0.1) return

      handleThrottleSetTransform({
        scale: Number(scale.toFixed(2)),
        translateX,
        translateY,
      })
    },
    [handleThrottleSetTransform, transform]
  )

  const handleMouseDown = useCallback(
    (event) => {
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
        }
      }
    },
    [dragState, transform]
  )

  // eslint-disable-next-line
  const handleThrottleSetSelectionArea = useCallback(
    throttle((e) => {
      if (mouseDownStartPosition.current && panelRef.current) {
        const panelRect = panelRef.current.getBoundingClientRect()
        setSelectionArea({
          left: Math.min(e.clientX, mouseDownStartPosition.current.x) - panelRect.x,
          top: Math.min(e.clientY, mouseDownStartPosition.current.y) - panelRect.y,
          width: Math.abs(e.clientX - mouseDownStartPosition.current.x),
          height: Math.abs(e.clientY - mouseDownStartPosition.current.y),
        })
        const selectAreaDom = selectionAreaRef.current
        const activeNodeIds = (value as IDiagramType).nodes
          .map((v) => v.id)
          .filter((id) => {
            return collideCheck(selectAreaDom, document.getElementById(id))
          })

        setActiveNodeIds(activeNodeIds)
      }
    }, 20),
    [transform, value]
  )

  const handleMouseUp = useCallback(
    (event) => {
      if (dragState === DRAG_STATE.MOVE) {
        setDragState(DRAG_STATE.START)
      } else {
        setDragState(DRAG_STATE.DEFAULT)
      }
      setSelectionArea(undefined)
      mouseDownStartPosition.current = undefined
    },
    [dragState]
  )

  const handleMouseMove = useCallback(
    (event) => {
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
    },
    [dragState, handleThrottleSetSelectionArea, handleThrottleSetTransform, transform, mouseDownStartPosition]
  )

  const handleKeyDown = useCallback(
    (event) => {
      if (event.keyCode === 32 && dragState === DRAG_STATE.DEFAULT) {
        setDragState(DRAG_STATE.START)
      }
    },
    [dragState]
  )

  const handleKeyUp = useCallback((event) => {
    if (event.keyCode === 32) {
      setDragState(DRAG_STATE.DEFAULT)
    }
  }, [])

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

  return (
    <div
      ref={panelRef}
      className="diagram-panel"
      onDrop={handleDrop}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      tabIndex={1}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      style={{ cursor }}
    >
      <Diagram
        value={value}
        transform={transform}
        onChange={handleChange}
        onAddHistory={handleAddHistory}
        activeNodeIds={activeNodeIds}
      />
      <NodeList />
      <Toolbar undo={undo} redo={redo} canUndo={canUndo} scale={transform.scale} canRedo={canRedo} />
      <div
        ref={selectionAreaRef}
        className="diagram-selection-area"
        hidden={hideSelectionArea}
        style={selectionAreaStyled}
      />
    </div>
  )
}

export default memo(DiagramPanel)
