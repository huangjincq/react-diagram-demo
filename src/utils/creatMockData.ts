import { IDiagramType } from '../types'

export const defaultValue: IDiagramType = {
  links: [
    { input: 'port-1', output: 'node-2' },
    { input: 'port-1', output: 'ebac3f07-598e-4e2f-9e81-e67e542322d8' },
    { input: 'node-5-port-1', output: 'node-2' },
    { input: 'node-1-port-1', output: 'node-5' },
    { input: 'node-5-port-2', output: 'node-4' },
    { input: 'node-4-port-3', output: 'node-3' },
  ],
  nodes: [
    {
      id: 'node-1',
      coordinates: [100, 100],
      inputs: [],
      outputs: [{ id: 'node-1-port-1', isLinked: true }],
      type: 'nodeTypeSingleOutputs',
      data: { inputValue: 'defaultValue' },
    },
    {
      id: 'node-2',
      coordinates: [600, 100],
      type: 'nodeTypeSingleInputs',
      inputs: [{ id: 'node-2-port-1', isLinked: false }],
      outputs: [],
      data: { inputValue: 'test' },
    },
    {
      id: 'node-3',
      coordinates: [850, 297],
      type: 'nodeTypeNoInputOutput',
      inputs: [],
      outputs: [],
      data: { inputValue: 'test' },
    },
    {
      id: 'node-4',
      coordinates: [600, 297],
      type: 'nodeTypeMultipleInputsOutputs',
      inputs: [
        { id: 'node-4-port-1', isLinked: false },
        { id: 'node-4-port-2', isLinked: false },
      ],
      outputs: [
        { id: 'node-4-port-3', isLinked: false },
        { id: 'node-4-port-4', isLinked: false },
        { id: 'node-4-port-5', isLinked: false },
      ],
      data: { inputValue: 'test' },
    },
    {
      id: 'node-5',
      coordinates: [350, 100],
      type: 'nodeTypeCustomRenderPort',
      inputs: [],
      outputs: [
        { id: 'node-5-port-1', isLinked: false },
        { id: 'node-5-port-2', isLinked: false },
      ],
      data: {
        branchList: [
          { text: 'button-1', id: 'd0ce404a' },
          { text: 'button-2', id: '1751249f' },
        ],
      },
    },
  ],
}

const manyNode: any = new Array(1000).fill({}).map((item, index) => {
  return {
    id: 'node-' + index,
    coordinates: [index * 40 + 200, index * 50],
    inputs: [],
    outputs: [{ id: 'port-' + index, isLinked: false }],
    type: 'nodeTypeInput',
    data: {
      inputValue: 'defaultValue',
    },
  }
})

const manyLink = new Array(999).fill({}).map((item, index) => {
  return { input: 'port-' + index, output: 'node-' + (index + 1) }
})

export const bigDataValue = {
  nodes: manyNode,
  links: manyLink,
}
