import { IDiagramType } from '../types'

export const defaultValue: IDiagramType = {
  links: [
    { input: 'port-1', output: 'node-2' },
    { input: 'port-1', output: 'ebac3f07-598e-4e2f-9e81-e67e542322d8' },
  ],
  nodes: [
    {
      id: 'node-1',
      coordinates: [100, 100],
      inputs: [],
      outputs: [{ id: 'port-1', isLinked: true }],
      type: 'nodeTypeSingleOutputs',
      data: { inputValue: 'defaultValue' },
    },
    {
      id: 'node-2',
      coordinates: [600, 100],
      type: 'nodeTypeSingleInputs',
      inputs: [{ id: '62852bf6-4cb8-4437-8cb9-d1edce72de1b', isLinked: false }],
      outputs: [],
      data: { inputValue: 'test' },
    },
    {
      id: 'node-3',
      coordinates: [800, 400],
      type: 'nodeTypeNoInputOutput',
      inputs: [],
      outputs: [],
      data: { inputValue: 'test' },
    },
    {
      id: 'node-4',
      coordinates: [500, 700],
      type: 'nodeTypeMultipleInputsOutputs',
      inputs: [
        { id: '34234', isLinked: false },
        { id: 'dfaerqw', isLinked: false },
      ],
      outputs: [
        { id: '1123', isLinked: false },
        { id: 'SADA', isLinked: false },
        { id: '3423FD', isLinked: false },
      ],
      data: { inputValue: 'test' },
    },
    {
      id: 'node-5',
      coordinates: [364, 353],
      type: 'nodeTypeCustomRenderPort',
      inputs: [],
      outputs: [
        { id: 'd0ce404a', isLinked: false },
        { id: '1751249f', isLinked: false },
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
