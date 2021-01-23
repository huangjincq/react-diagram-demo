import React, { useCallback, useState } from 'react'
import { Diagram } from './components/Diagram/Diagram'
import { useHistory } from './hooks/useHistory'
import { Toolbar } from './components/Toolbar/Toolbar'
import { NodeList } from './components/NodeList/NodeList'
import { IDiagramType, ICoordinateType } from './types'
import { createNode } from './components/NodeTypes/helper'

const defaultValue: IDiagramType = {
  nodes: [
    {
      id: 'node-1',
      coordinates: [100, 150],
      inputs: [],
      outputs: [
        {id: 'port-1', disabled: false}
      ],
      type: 'node-type-input',
      data: {
        foo: 'bar',
        count: 0
      }
    },
    {
      id: 'node-2',
      type: 'node-type-select',
      coordinates: [400, 200],
      inputs: [],
      outputs: [
        {id: 'port-5', disabled: false},
        {id: 'port-6', disabled: false}
      ],
      data: {
        bar: 'foo'
      }
    }
  ],
  links: [{input: 'port-1', output: 'node-2'}]
}

function App() {
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

  const handleDrop = (event: any) => {
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
  }
  const handleDrag = (e: any) => {
    e.preventDefault()
  }


  return (
    <div className="App" onDrop={handleDrop} onDragEnter={handleDrag} onDragOver={handleDrag}>
      <Diagram value={state} scale={scale} onChange={handleChange} onAddHistory={handleAddHistory}/>
      <NodeList/>

      <Toolbar undo={undo} redo={redo} canUndo={canUndo} scale={scale} setScale={setScale} canRedo={canRedo}/>
    </div>
  )
}

export default App
