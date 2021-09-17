import { NodeTypeInput } from './NodeTypeInput'
import { NodeTypeSelect } from './NodeTypeSelect'
import { NodeTypeBranch } from './NodeTypeBranch'
import { AppleOutlined, WindowsOutlined, GithubOutlined } from '@ant-design/icons'
import { v4 as uuidv4 } from 'uuid'
import { ICoordinateType, INodeType, NodeTypeEnum } from '../../types'
/*
 * 1. 单出口节点
 * 2. 单入口节点
 * 3. 无出入口节点
 * 4. 多出口 多入口节点
 * 5. 自定义渲染节点
 */
export enum NodeTypes {
  nodeTypeInput = 'nodeTypeInput',
  nodeTypeSelect = 'nodeTypeSelect',
  NodeTypeBranch = 'NodeTypeBranch',
}

export const nodesConfig = {
  [NodeTypes.nodeTypeInput]: {
    component: NodeTypeInput,
    label: 'Input 节点',
    icon: AppleOutlined,
    customRenderPort: false,
    defaultValue: () => {
      return {
        id: uuidv4(),
        coordinates: [0, 0],
        type: NodeTypes.nodeTypeInput,
        inputs: [],
        outputs: [{ id: uuidv4(), isLinked: false }],
        data: {
          inputValue: '',
        },
      }
    },
  },
  [NodeTypes.nodeTypeSelect]: {
    component: NodeTypeSelect,
    label: 'Select 节点',
    icon: WindowsOutlined,
    customRenderPort: false,
    defaultValue: () => {
      return {
        id: uuidv4(),
        coordinates: [0, 0],
        type: NodeTypes.nodeTypeSelect,
        inputs: [{ id: uuidv4(), isLinked: false }],
        outputs: [{ id: uuidv4(), isLinked: false }],
        data: {
          inputValue: '',
          selectValue: '',
        },
      }
    },
  },
  [NodeTypes.NodeTypeBranch]: {
    component: NodeTypeBranch,
    label: '分支 节点',
    icon: GithubOutlined,
    customRenderPort: true,
    defaultValue: () => {
      const branchList = [
        { id: uuidv4(), text: '' },
        { id: uuidv4(), text: '' },
      ]
      // 由数据映射输出点
      const outputs = branchList.map((item) => ({ id: item.id, isLinked: false }))
      return {
        id: uuidv4(),
        coordinates: [0, 0],
        type: NodeTypes.NodeTypeBranch,
        inputs: [],
        outputs,
        data: {
          inputValue: '',
          branchList,
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
