import { NodeTypeSingleOutputs } from './NodeTypeSingleOutputs'
import { NodeTypeSingleInputs } from './NodeTypeSingleInputs'
import { NodeTypeCustomRenderPort } from './NodeTypeCustomRenderPort'
import { NodeTypeNoInputOutput } from './NodeTypeNoInputOutput'
import { AppleOutlined, WindowsOutlined, GithubOutlined } from '@ant-design/icons'
import { v4 as uuidv4 } from 'uuid'
import { ICoordinateType, INodeType, NodeTypeEnum } from '../../types'
import { NodeTypeMultipleInputsOutputs } from './NodeTypeMultipleInputsOutputs'
/*
 * 1. 单出口节点
 * 2. 单入口节点
 * 3. 无出入口节点
 * 4. 多出口 多入口节点
 * 5. 自定义渲染节点
 */
export enum NodeTypes {
  nodeTypeSingleOutputs = 'nodeTypeSingleOutputs', // 单出口节点
  nodeTypeSingleInputs = 'nodeTypeSingleInputs', // 单入口节点
  nodeTypeNoInputOutput = 'nodeTypeNoInputOutput', // 无出入口节点
  nodeTypeMultipleInputsOutputs = 'nodeTypeMultipleInputsOutputs', // 多出口 多入口节点
  nodeTypeCustomRenderPort = 'nodeTypeCustomRenderPort', // 自定义渲染节点
}

export const nodesConfig = {
  [NodeTypes.nodeTypeSingleOutputs]: {
    component: NodeTypeSingleOutputs,
    label: '单出口 节点',
    icon: AppleOutlined,
    customRenderPort: false,
    defaultValue: () => {
      return {
        id: uuidv4(),
        coordinates: [0, 0],
        type: NodeTypes.nodeTypeSingleOutputs,
        inputs: [],
        outputs: [{ id: uuidv4(), isLinked: false }],
        data: {
          inputValue: '',
        },
      }
    },
  },
  [NodeTypes.nodeTypeSingleInputs]: {
    component: NodeTypeSingleInputs,
    label: '单入口 节点',
    icon: WindowsOutlined,
    customRenderPort: false,
    defaultValue: () => {
      return {
        id: uuidv4(),
        coordinates: [0, 0],
        type: NodeTypes.nodeTypeSingleInputs,
        inputs: [{ id: uuidv4(), isLinked: false }],
        outputs: [],
        data: {
          inputValue: '',
          selectValue: '',
        },
      }
    },
  },
  [NodeTypes.nodeTypeNoInputOutput]: {
    component: NodeTypeNoInputOutput,
    label: '无出入口 节点',
    icon: WindowsOutlined,
    customRenderPort: false,
    defaultValue: () => {
      return {
        id: uuidv4(),
        coordinates: [0, 0],
        type: NodeTypes.nodeTypeNoInputOutput,
        inputs: [],
        outputs: [],
        data: {
          inputValue: '',
          selectValue: '',
        },
      }
    },
  },
  [NodeTypes.nodeTypeMultipleInputsOutputs]: {
    component: NodeTypeMultipleInputsOutputs,
    label: '多出口 多入口 节点',
    icon: WindowsOutlined,
    customRenderPort: false,
    defaultValue: () => {
      return {
        id: uuidv4(),
        coordinates: [0, 0],
        type: NodeTypes.nodeTypeNoInputOutput,
        inputs: [
          { id: uuidv4(), isLinked: false },
          { id: uuidv4(), isLinked: false },
        ],
        outputs: [
          { id: uuidv4(), isLinked: false },
          { id: uuidv4(), isLinked: false },
          { id: uuidv4(), isLinked: false },
        ],
        data: {
          inputValue: '',
          selectValue: '',
        },
      }
    },
  },
  [NodeTypes.nodeTypeCustomRenderPort]: {
    component: NodeTypeCustomRenderPort,
    label: '自定义渲染 点 节点',
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
        type: NodeTypes.nodeTypeCustomRenderPort,
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
