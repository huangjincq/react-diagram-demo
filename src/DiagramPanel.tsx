import React, { useCallback, useState } from 'react'
import { Diagram } from './components/Diagram'
import { useHistory } from './hooks/useHistory'
import { Toolbar } from './components/Toolbar/Toolbar'
import { NodeList } from './components/NodeList/NodeList'
import { IDiagramType, ICoordinateType } from './types'
import { createNode } from './components/NodeTypes/config'

// const manyNode = new Array(100).fill({}).map()

const defaultValue: IDiagramType = {
  nodes: [
    {
      id: 'node-1',
      coordinates: [100, 150],
      inputs: [],
      outputs: [
        {id: 'port-1', disabled: false}
      ],
      type: 'nodeTypeInput',
      data: {
        inputValue: 'defaultValue'
      }
    },
    {
      id: 'node-2',
      type: 'nodeTypeSelect',
      coordinates: [400, 200],
      inputs: [],
      outputs: [
        {id: 'port-5', disabled: false},
        {id: 'port-6', disabled: false}
      ],
      data: {
        selectValue: ''
      }
    }
  ],
  links: [{input: 'port-1', output: 'node-2'}]
}

function DiagramPanel() {
  const {state, set, setHistory, undo, redo, clear, canUndo, canRedo} = useHistory(defaultValue)
  const [scale, setScale] = useState<number>(1)


  // const [schema, setSchema] = useState(defaultValue)
  const handleChange = useCallback(
    (value: any) => {
      const newValue = {...state, ...value}
      set(newValue)
    },
    [set, state]
  )

  const handleAddHistory = (nodes: any) => {
    const newValue = {...state, nodes}
    setHistory(newValue)
  }

  const handleDrop = useCallback((event: any) => {
    if (event) {
      event = window.event
    }
    const nodeType = event.dataTransfer.getData('nodeType')
    const x = event.clientX
    const y = event.clientY

    const diagramCanvasRect = document.getElementById('diagram-canvas')?.getBoundingClientRect() || {x: 0, y: 0}

    const coordinates: ICoordinateType = [
      (x - diagramCanvasRect.x) / scale,
      (y - diagramCanvasRect.y) / scale
    ]
    const newNode = createNode(nodeType, coordinates)
    handleChange({nodes: [...state.nodes, newNode]})
  }, [handleChange, scale, state.nodes])

  const handleDrag = useCallback((e: any) => {
    e.preventDefault()
  }, [])


  return (
    <div className="diagram-panel" onDrop={handleDrop} onDragEnter={handleDrag} onDragOver={handleDrag} tabIndex={0}>
      <Diagram value={state} scale={scale} onChange={handleChange} onAddHistory={handleAddHistory}/>
      <NodeList/>
      <Toolbar undo={undo} redo={redo} canUndo={canUndo} scale={scale} setScale={setScale} canRedo={canRedo}/>
    </div>
  )
}

export default DiagramPanel
