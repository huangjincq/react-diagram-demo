import { NodeTypeInput } from './NodeTypeInput'
import { NodeTypeSelect } from './NodeTypeSelect'
import { NodeTypeButton } from './NodeTypeButton'
import { AppleOutlined, WindowsOutlined, GithubOutlined } from '@ant-design/icons'
import { v4 as uuidv4 } from 'uuid'

export enum NodeTypes {
  nodeTypeInput = 'nodeTypeInput',
  nodeTypeSelect = 'nodeTypeSelect',
  nodeTypeButton = 'nodeTypeButton'
}

export const nodesConfig = {
  [NodeTypes.nodeTypeInput]: {
    component: NodeTypeInput,
    label: 'Input 节点',
    icon: AppleOutlined
  },
  [NodeTypes.nodeTypeSelect]: {
    component: NodeTypeSelect,
    label: 'Select 节点',
    icon: WindowsOutlined
  },
  [NodeTypes.nodeTypeButton]: {
    component: NodeTypeButton,
    label: 'Button 节点',
    icon: GithubOutlined
  }
}

export const nodesList = Object.entries(nodesConfig).map(([key, value]) => {
  return {
    ...value,
    type: key
  }
})

export const createNode = (nodeType: string, coordinates = [0, 0]) => {
  const nodeData = {
    id: uuidv4(),
    coordinates,
    type: nodeType,
    inputs: [],
    outputs: [{id: uuidv4(), disabled: false}],
    data: {}
  }
  switch (nodeType) {
    case NodeTypes.nodeTypeInput:
      nodeData.data = {
        inputValue: 'test'
      }
      break
    case NodeTypes.nodeTypeSelect:
      nodeData.data = {
        inputValue: ''
      }
      break
    case NodeTypes.nodeTypeButton:
      nodeData.data = {
        buttonList: [
          {text: 'button-1', id: uuidv4()},
          {text: 'button-2', id: uuidv4()}
        ]
      }
      nodeData.outputs = (nodeData.data as any).buttonList.map((item: any) => ({
        id: item.id,
        disable: false
      }))

      break
  }

  return nodeData
}
