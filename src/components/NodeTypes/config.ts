import { NodeTypeInput } from './NodeTypeInput'
import { NodeTypeSelect } from './NodeTypeSelect'
import { AppleOutlined, WindowsOutlined } from '@ant-design/icons'
import { v4 as uuidv4 } from 'uuid'


export const nodesConfig = {
  'nodeTypeInput': {
    component: NodeTypeInput,
    label: 'Input 节点',
    icon: AppleOutlined,
    defaultData: {
      inputValue: 'test'
    }
  },
  'nodeTypeSelect': {
    component: NodeTypeSelect,
    label: 'Select 节点',
    icon: WindowsOutlined,
    defaultData: {
      selectValue: ''
    }
  }
}

export const nodesList = Object.entries(nodesConfig).map(([key, value]) => {
  return {
    ...value,
    type: key
  }
})


export const createNode = (nodeType: string, coordinates = [0, 0]) => {
  return {
    id: uuidv4(),
    coordinates,
    type: nodeType,
    inputs: [],
    outputs: [
      {id: uuidv4(), disabled: false}
    ],
    data: (nodesConfig as any)[nodeType]?.defaultData || {}
  }
}
