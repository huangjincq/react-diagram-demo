import { groupBy, maxBy, omit } from 'lodash-es'
import { getNodeStyle } from '.'
import { IDiagramType, ILinkType, INodeRefs, INodeStyle, INodeType, IPointType } from '../types'

const checkPortIsNodeSon = (ports: IPointType[], entityId: string) => {
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
      if (checkPortIsNodeSon(node.inputs, entityId)) return node.id
      if (checkPortIsNodeSon(node.outputs, entityId)) return node.id
    }
  }
  return entityId
}

const checkIsStartLink = (linkInput: string, links: ILinkType[], nodes: INodeType[]) =>
  !links.find((link) => link.output === findPortFatherNodeId(linkInput, nodes))

interface ExtendActionDto extends INodeType {
  row: number
  column: number
  style: INodeStyle
}

const recursionLookup = (
  linkEndId: string,
  baseColumn: number,
  row: number,
  extendNodes: ExtendActionDto[],
  links: ILinkType[],
  catchNodeIds: string[]
) => {
  if (catchNodeIds.includes(linkEndId)) return
  catchNodeIds.push(linkEndId)
  const nodeIndex = extendNodes.findIndex((node) => node.id === findPortFatherNodeId(linkEndId, extendNodes))
  extendNodes[nodeIndex].row = row
  extendNodes[nodeIndex].column = baseColumn
  baseColumn++

  extendNodes[nodeIndex].outputs.forEach((port) => {
    const findLink = links.find((link) => link.input === port.id)

    if (findLink) {
      recursionLookup(findLink.output, baseColumn, row, extendNodes, links, catchNodeIds)
    }
  })
}
/*
 * 自动排列 需要根据实际的点和线 连接放松排列 这里的自动排列涵盖情况有限 重新排列效果仅供参考
 */
export default function autoLayout(value: IDiagramType, nodeRefs: INodeRefs) {
  const { links = [], nodes = [] } = value
  let row = 1
  const extendNodes = nodes.map((node) => {
    return {
      ...node,
      row: 0,
      column: 0,
      style: getNodeStyle(nodeRefs[node.id]),
    }
  })

  links.forEach((link) => {
    if (checkIsStartLink(link.input, links, extendNodes)) {
      const portFatherNodeId = findPortFatherNodeId(link.input, extendNodes)
      const catchNodeIds = [portFatherNodeId]
      const nodeIndex = extendNodes.findIndex((node) => node.id === portFatherNodeId)
      extendNodes[nodeIndex].row = extendNodes[nodeIndex].row || row
      extendNodes[nodeIndex].column = 1
      recursionLookup(link.output, 2, row, extendNodes, links, catchNodeIds)
      row++
    }
  })

  // if is init data update row and column
  extendNodes.forEach((node) => {
    if (node.row === 0) {
      node.row = row
      node.column = 1
      row++
    }
  })

  const extendNodesCopy = [...extendNodes]
  extendNodesCopy.forEach(({ outputs }) => {
    const nextNodeIds: string[] = []
    outputs.forEach((port) => {
      if (port.isLinked) {
        const findLink = links.find((link) => link.input === port.id)
        if (findLink) {
          nextNodeIds.push(findLink.output)
        }
      }
    })
    extendNodes.sort((a, b) => {
      return nextNodeIds.findIndex((nodeId) => a.id === nodeId) - nextNodeIds.findIndex((nodeId) => b.id === nodeId)
    })
  })

  const groupRow = groupBy(extendNodes, (item) => item.row)

  const SPACING = 50
  const LAYOUT_BASIC_COORDINATE = {
    LEFT: 100,
    TOP: 100,
  }

  const COLUMN_STEP_WIDTH = 200 + SPACING
  let baseRowTop = LAYOUT_BASIC_COORDINATE.TOP

  Object.values(groupRow).forEach((aRow) => {
    const groupColum = groupBy(aRow, (item) => item.column)
    const aRowHeightList = Object.values(groupColum).map((aColumn) => {
      let currentTop = baseRowTop

      aColumn.forEach((cell) => {
        cell.coordinates = [(cell.column - 1) * COLUMN_STEP_WIDTH + LAYOUT_BASIC_COORDINATE.LEFT, currentTop]
        currentTop += cell.style.height + SPACING
      })

      const columnReduceHeight = aColumn.reduce((pre: number, cur) => cur.style.height + pre + SPACING, 0)

      return columnReduceHeight
    })
    const rowMaxHeight = maxBy(aRowHeightList) || 0
    baseRowTop += rowMaxHeight
  })

  const newNodes = extendNodes.map((node) => {
    return {
      ...omit(node, 'column', 'row', 'style'),
    }
  })
  return { links: links, nodes: newNodes }
}
