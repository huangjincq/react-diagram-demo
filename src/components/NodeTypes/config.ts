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
  },
  [NodeTypes.nodeTypeSelect]: {
    component: NodeTypeSelect,
    label: 'Select 节点',
    icon: WindowsOutlined,
  },
  [NodeTypes.nodeTypeButton]: {
    component: NodeTypeButton,
    label: 'Button 节点',
    icon: GithubOutlined,
  },
}

export const nodesList = Object.entries(nodesConfig).map(([key, value]) => {
  return {
    ...value,
    type: key,
  }
})

export const createNode = (nodeType: NodeTypeEnum, coordinate: ICoordinateType): INodeType => {
  let nodeData: INodeType = {
    id: uuidv4(),
    coordinates: coordinate,
    type: nodeType,
    inputs: [],
    outputs: [],
    data: {},
  }
  switch (nodeType) {
    case NodeTypes.nodeTypeInput:
      nodeData = {
        ...nodeData,
        outputs: [{ id: uuidv4(), isLinked: false }],
        data: {
          inputValue: 'test',
        },
      }

      break
    case NodeTypes.nodeTypeSelect:
      nodeData = {
        ...nodeData,
        outputs: [{ id: uuidv4(), isLinked: false }],
        data: {
          inputValue: '',
        },
      }
      break
    case NodeTypes.nodeTypeButton:
      const buttonData = {
        buttonList: [
          { text: 'button-1', id: uuidv4() },
          { text: 'button-2', id: uuidv4() },
        ],
      }
      const outputs = buttonData.buttonList.map((item: any) => ({
        id: item.id,
        isLinked: false,
      }))
      nodeData = {
        ...nodeData,
        outputs: outputs,
        data: buttonData,
      }
      break
  }

  return nodeData
}
