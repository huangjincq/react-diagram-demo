import { IDiagramType } from '../types'

export const defaultValue: IDiagramType = {
  links: [
    { input: 'port-1', output: 'node-2' },
    { input: 'port-1', output: 'ebac3f07-598e-4e2f-9e81-e67e542322d8' },
    // {
    //   input: 'port-5',
    //   output: '841e9704-c295-4915-8ba9-1d8ab4e6b172',
    // },
    // {
    //   input: 'd0ce404a-d95c-4210-be5d-106cb707ecda',
    //   output: '0d8dcb00-7c54-488a-9e85-0f92cb463cc3',
    // },
    // { input: '1751249f-fb2c-44ed-b324-e99cf1d8a5fd', output: '1a5f12bc-9d9c-48e2-905d-97e865845e87' },
  ],
  nodes: [
    {
      id: 'node-1',
      coordinates: [100, 100],
      inputs: [],
      outputs: [{ id: 'port-1', isLinked: true }],
      type: 'nodeTypeInput',
      data: { inputValue: 'defaultValue' },
    },
    {
      id: 'node-2',
      coordinates: [600, 100],
      type: 'nodeTypeInput',
      inputs: [],
      outputs: [{ id: '62852bf6-4cb8-4437-8cb9-d1edce72de1b', isLinked: false }],
      data: { inputValue: 'test' },
    },
    {
      id: 'ebac3f07-598e-4e2f-9e81-e67e542322d8',
      coordinates: [364, 353],
      type: 'nodeTypeButton',
      inputs: [],
      outputs: [
        {
          id: 'd0ce404a-d95c-4210-be5d-106cb707ecda',
          isLinked: false,
        },
        { id: '1751249f-fb2c-44ed-b324-e99cf1d8a5fd', isLinked: false },
      ],
      data: {
        buttonList: [
          { text: 'button-1', id: 'd0ce404a-d95c-4210-be5d-106cb707ecda' },
          {
            text: 'button-2',
            id: '1751249f-fb2c-44ed-b324-e99cf1d8a5fd',
          },
        ],
      },
    },
    // {
    //   id: '0d8dcb00-7c54-488a-9e85-0f92cb463cc3',
    //   coordinates: [604, 353],
    //   type: 'nodeTypeInput',
    //   inputs: [],
    //   outputs: [{ id: 'f854d9bc-0b0e-481c-acfe-786a20483726', isLinked: false }],
    //   data: { inputValue: 'input' },
    // },
    // {
    //   id: 'f57ee82a-2f1e-45e8-905a-187d36a45dbb',
    //   coordinates: [100, 370],
    //   type: 'nodeTypeSelect',
    //   inputs: [],
    //   outputs: [{ id: '459c4240-26f7-4351-857d-ba856ca755cb', isLinked: false }],
    //   data: { inputValue: '', selectValue: 'lucy' },
    // },
    // {
    //   id: 'node-2',
    //   type: 'nodeTypeSelect',
    //   coordinates: [367, 226],
    //   inputs: [{ id: 'input-1', isLinked: false }],
    //   outputs: [{ id: 'port-5', isLinked: false }],
    //   data: { selectValue: '' },
    // },
    // {
    //   id: '1a5f12bc-9d9c-48e2-905d-97e865845e87',
    //   coordinates: [597, 478],
    //   type: 'nodeTypeSelect',
    //   inputs: [],
    //   outputs: [{ id: '2d16159f-3f1c-4370-b3fc-28bd8e51c388', isLinked: false }],
    //   data: { inputValue: '' },
    // },
  ],
}

const manyNode: any = new Array(500).fill({}).map((item, index) => {
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

const manyLink = new Array(400).fill({}).map((item, index) => {
  return { input: 'port-' + index, output: 'node-' + (index + 1) }
})

export const bigDataValue = {
  nodes: manyNode,
  links: manyLink,
}
