import React, {useCallback} from 'react'
import Diagram from './components/Diagram/Diagram'
import {useHistory} from './hooks/useHistory'
import { Button } from 'antd';


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

  // const [schema, setSchema] = useState(defaultValue)
  const handleChange = useCallback((value: any) => {
    const newValue = {...state, ...value}
    set(newValue)
  }, [set, state])

  const hanleAddHistory = (value:any) => {
    const newValue = {...state, ...value}
    setHistory(newValue)
  }

  return (
    <div className="App">
      <Diagram schema={state} onChange={handleChange} onAddHistory={hanleAddHistory}/>
      <Button onClick={undo}>undo</Button>
      <Button onClick={redo}>redo</Button>
    </div>
  )
}

export default App
