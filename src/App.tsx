import React, {useCallback, useState} from 'react'
import Diagram from './components/Diagram/Diagram'
import {useHistory} from './hooks/useHistory'
import {Toolbar} from './components/Toolbar/Toolbar'


const defaultValue = {
  nodes: [
    {
      id: 'node-1',
      content: 'Start',
      coordinates: [100, 150],
      outputs: [
        {id: 'port-1', alignment: 'right'},
        // {id: 'port-2', alignment: 'right'},
      ],
      disableDrag: false,
      data: {
        foo: 'bar',
        count: 0,
      }
    },
    {
      id: 'node-2',
      content: 'Middle',
      coordinates: [300, 150],
      inputs: [
        // {id: 'port-3', alignment: 'left'},
        // {id: 'port-4', alignment: 'left'},
      ],
      outputs: [
        // {id: 'port-5', alignment: 'right'},
        // {id: 'port-6', alignment: 'right'},
      ],
      data: {
        bar: 'foo',
      }
    }
  ],
  links: [
    {input: 'port-1', output: 'node-2'},
  ]
}

function App() {
  const {state, set, setHistory, undo, redo, clear, canUndo, canRedo} = useHistory(defaultValue)
  const [scale, setScale] = useState<number>(1)

  // const [schema, setSchema] = useState(defaultValue)
  const handleChange = useCallback((value: any) => {
    const newValue = {...state, ...value}
    set(newValue)

  }, [set, state])

  const handleAddHistory = (nodes: any) => {
    const newValue = {...state, nodes}
    setHistory(newValue)

  }


  return (
    <div className="App">
      <Diagram schema={state} scale={scale} onChange={handleChange} onAddHistory={handleAddHistory}/>

      <Toolbar undo={undo} redo={redo} canUndo={canUndo} scale={scale} setScale={setScale} canRedo={canRedo}/>
    </div>
  )
}

export default App
