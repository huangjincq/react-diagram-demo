import { IDiagramType, ILinkType, INodeRefs, INodeType, IPointType } from '../types'

const checkPortisNodeSon = (ports: IPointType[], entityId: string) => {
  for (let j = 0; j < ports.length; j++) {
    const input = ports[j]
    if (input.id === entityId) {
      return true
    }
  }
  return false
}

const findPortFatherNodeId = (entityId: string, nodes: INodeType[]) => {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    // 如果 id 是 nodeId
    if (node.id === entityId) {
      return node.id
    } else {
      if (checkPortisNodeSon(node.inputs, entityId)) return node.id
      if (checkPortisNodeSon(node.outputs, entityId)) return node.id
    }
  }
  return entityId
}

const checkIsStartLink = (linkInput: string, links: ILinkType[], nodes: INodeType[]) =>
  !links.find((link) => link.output === findPortFatherNodeId(linkInput, nodes))

interface ExtendActionDto extends INodeType {
  row: number
  column: number
  style: any
}

function recursionLookup(
  linkEndId: string,
  baseColumn: number,
  row: number,
  extendNodes: ExtendActionDto[],
  links: ILinkType[],
  maxLoopCount = 1000
) {
  const nodeIndex = extendNodes.findIndex((node) => node.id === linkEndId)
  extendNodes[nodeIndex].row = row
  extendNodes[nodeIndex].column = baseColumn
  baseColumn++
  if (baseColumn > maxLoopCount + 10) {
    return
  }
  extendNodes[nodeIndex].outputs.forEach((port) => {
    if (port.isLinked) {
      const findLink = links.find((link) => link.input === port.id)
      if (findLink) {
        recursionLookup(findLink.output, baseColumn, row, extendNodes, links, maxLoopCount)
      }
    }
  })
}

export default function (value: IDiagramType, nodeRefs: INodeRefs) {
  const { links = [], nodes = [] } = value
  let row = 1
  const extendNodes = nodes.map((node) => {
    return {
      ...node,
      row: 0,
      column: 0,
      style: {},
    }
  })

  const maxLoopCount = nodes.reduce((pre, cur) => pre + cur.outputs.length + cur.inputs.length + 1, 0)

  // links.forEach()

  console.log(value)
}
