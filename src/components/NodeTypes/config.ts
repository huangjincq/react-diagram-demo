import { NodeTypeInput } from './NodeTypeInput'
import { NodeTypeSelect } from './NodeTypeSelect'
import { NodeTypeButton } from './NodeTypeButton'
import { AppleOutlined, WindowsOutlined, GithubOutlined } from '@ant-design/icons'
import { v4 as uuidv4 } from 'uuid'
import { ICoordinateType, INodeType, NodeTypeEnum } from '../../types'

export enum NodeTypes {
  nodeTypeInput = 'nodeTypeInput',
  nodeTypeSelect = 'nodeTypeSelect',
  nodeTypeButton = 'nodeTypeButton',
}

export const nodesConfig = {
  [NodeTypes.nodeTypeInput]: {
    component: NodeTypeInput,
    label: 'Input 节点',
    icon: AppleOutlined,
    defaultValue: () => {
      return {
        id: uuidv4(),
        coordinates: [0, 0],
        type: NodeTypes.nodeTypeInput,
        inputs: [{ id: uuidv4(), isLinked: false }],
        outputs: [{ id: uuidv4(), isLinked: false }],
        data: {
          inputValue: 'default input value',
        },
      }
    },
  },
  [NodeTypes.nodeTypeSelect]: {
    component: NodeTypeSelect,
    label: 'Select 节点',
    icon: WindowsOutlined,
    defaultValue: () => {
      return {
        id: uuidv4(),
        coordinates: [0, 0],
        type: NodeTypes.nodeTypeInput,
        inputs: [{ id: uuidv4(), isLinked: false }],
        outputs: [{ id: uuidv4(), isLinked: false }],
        data: {
          inputValue: 'default select value',
        },
      }
    },
  },
  [NodeTypes.nodeTypeButton]: {
    component: NodeTypeButton,
    label: 'Button 节点',
    icon: GithubOutlined,
    defaultValue: () => {
      return {
        id: uuidv4(),
        coordinates: [0, 0],
        type: NodeTypes.nodeTypeInput,
        inputs: [{ id: uuidv4(), isLinked: false }],
        outputs: [{ id: uuidv4(), isLinked: false }],
        data: {
          inputValue: 'default select',
        },
      }
    },
  },
}

export const nodesList = Object.entries(nodesConfig).map(([key, value]) => {
  return {
    ...value,
    type: key,
  }
})

export const createNode = (nodeType: NodeTypeEnum, coordinate: ICoordinateType): INodeType => {
  const { defaultValue } = nodesConfig[nodeType]

  return { ...defaultValue(), coordinates: coordinate }
}
