import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Diagram } from './components/Diagram'
import { useHistory } from './hooks/useHistory'
import { Toolbar } from './components/Toolbar/Toolbar'
import { NodeList } from './components/NodeList/NodeList'
import { IDiagramType, ICoordinateType, ITranslate, IMousePosition } from './types'
import { createNode } from './components/NodeTypes/config'
import { throttle } from 'lodash-es'

// const manyNode = new Array(100).fill({}).map()

const defaultValue: IDiagramType = {
  nodes: [
    {
      id: 'node-1',
      coordinates: [100, 150],
      inputs: [],
      outputs: [{ id: 'port-1', isLinked: true }],
      type: 'nodeTypeInput',
      data: {
        inputValue: 'defaultValue',
      },
    },
    {
      id: 'node-2',
      type: 'nodeTypeSelect',
      coordinates: [400, 200],
      inputs: [{ id: 'input-1', isLinked: false }],
      outputs: [
        { id: 'port-5', isLinked: false },
        { id: 'port-6', isLinked: false },
      ],
      data: {
        selectValue: '',
      },
    },
  ],
  links: [{ input: 'port-1', output: 'node-2' }],
}

const SCALE_STEP = 0.1

const DRAG_STATE = {
  DEFAULT: 'DEFAULT',
  START: 'START',
  MOVE: 'MOVE',
  END: 'END',
}

const CURSOR_MAP = {
  [DRAG_STATE.DEFAULT]: 'default',
  [DRAG_STATE.START]: 'grab',
  [DRAG_STATE.MOVE]: 'grabbing',
}

function DiagramPanel() {
  const { state, set, setHistory, undo, redo, clear, canUndo, canRedo } = useHistory(defaultValue)
  const [scale, setScale] = useState<number>(1)
  const [translate, setTranslate] = useState<ITranslate>({ x: 0, y: 0 })
  const [dragState, setDragState] = useState<string>(DRAG_STATE.DEFAULT)
  const mouseDownStartPosition = useRef<IMousePosition>({ x: 0, y: 0 })

  // const [schema, setSchema] = useState(defaultValue)
  const handleChange = useCallback(
    (value: any) => {
      const newValue = { ...state, ...value }
      set(newValue)
    },
    [set, state]
  )

  const handleAddHistory = (nodes: any) => {
    const newValue = { ...state, nodes }
    setHistory(newValue)
  }

  const handleDrop = useCallback(
    (event: any) => {
      if (event) {
        event = window.event
      }
      const nodeType = event.dataTransfer.getData('nodeType')
      const x = event.clientX
      const y = event.clientY

      const diagramCanvasRect = document.getElementById('diagram-canvas')?.getBoundingClientRect() || { x: 0, y: 0 }

      const coordinates: ICoordinateType = [(x - diagramCanvasRect.x) / scale, (y - diagramCanvasRect.y) / scale]
      const newNode = createNode(nodeType, coordinates)
      handleChange({ nodes: [...state.nodes, newNode] })
    },
    [handleChange, scale, state.nodes]
  )

  const handleDrag = useCallback((e: any) => {
    e.preventDefault()
  }, [])

  const handleWheel = useCallback(
    (event: any) => {
      const wheelDelta = event.nativeEvent.wheelDelta
      if (wheelDelta < 0 && scale > 0) {
        setScale(scale - SCALE_STEP)
      }
      if (wheelDelta > 0 && scale < 1) {
        setScale(scale + SCALE_STEP)
      }
    },
    [scale]
  )

  const handleMouseDown = useCallback((event) => {
    mouseDownStartPosition.current = {
      x: event.clientY,
      y: event.clientY,
    }
  }, [])

  const handleMouseMove = useCallback((event) => {}, [])

  const handleThrottleSetTranslate = useCallback(
    throttle(() => {}, 20),
    []
  )

  const handleKeyDown = useCallback(
    (event) => {
      if (event.keyCode === 32) {
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

  return (
    <div
      className="diagram-panel"
      onDrop={handleDrop}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      tabIndex={0}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      style={{ cursor }}
    >
      <Diagram
        value={state}
        scale={scale}
        translate={translate}
        onChange={handleChange}
        onAddHistory={handleAddHistory}
      />
      <NodeList />
      <Toolbar undo={undo} redo={redo} canUndo={canUndo} scale={scale} setScale={setScale} canRedo={canRedo} />
    </div>
  )
}

export default DiagramPanel
