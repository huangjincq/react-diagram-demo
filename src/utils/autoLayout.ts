import { groupBy, isEqual, maxBy, omit } from 'lodash-es'
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

  const recursionLookup = (
    linkEndId: string,
    baseColumn: number,
    extendNodes: ExtendActionDto[],
    links: ILinkType[],
    catchNodeIds: string[]
  ) => {
    if (catchNodeIds.includes(linkEndId)) return
    catchNodeIds.push(linkEndId)
    const currentNode = extendNodes.find((node) => node.id === findPortFatherNodeId(linkEndId, extendNodes))
    if (!currentNode) return
    currentNode.row = currentNode.row || row
    currentNode.column = currentNode.column || baseColumn
    baseColumn++
    let outputHasLinkNum = 0

    currentNode.outputs.forEach((port) => {
      const findLink = links.find((link) => link.input === port.id)
      if (findLink) {
        outputHasLinkNum++
        if (outputHasLinkNum > 1) {
          row++
        }
        recursionLookup(findLink.output, baseColumn, extendNodes, links, catchNodeIds)
      }
    })
  }

  links.forEach((link) => {
    if (checkIsStartLink(link.input, links, extendNodes)) {
      const portFatherNodeId = findPortFatherNodeId(link.input, extendNodes)
      const catchNodeIds = [portFatherNodeId]
      const currentNode = extendNodes.find((node) => node.id === portFatherNodeId)
      if (!currentNode) return
      currentNode.row = currentNode.row || row
      currentNode.column = 1
      recursionLookup(link.output, 2, extendNodes, links, catchNodeIds)
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

  const SPACING = 50
  const LAYOUT_BASIC_COORDINATE = {
    LEFT: 100,
    TOP: 100,
  }

  const COLUMN_STEP_WIDTH = 200 + SPACING
  const groupRowMap = groupBy(extendNodes, (item) => item.row)
  const groupRows = Object.values(groupRowMap)

  // row start top
  let currentTop = LAYOUT_BASIC_COORDINATE.TOP

  groupRows.forEach((aRow, rowIndex) => {
    // sort by column
    aRow.sort((a, b) => a.column - b.column)

    aRow.forEach((cell, cellIndex) => {
      if (cellIndex === 0 && rowIndex > 0) {
        const preRow = groupRows[rowIndex - 1]

        const currentAfterPreRow = preRow.filter((preCell) => preCell.column >= cell.column)

        const currentAfterPreRowMaxHeightList = currentAfterPreRow.map((cell) => cell.style.height)

        const rowMaxHeight = maxBy(currentAfterPreRowMaxHeightList) || 0
        currentTop += rowMaxHeight + SPACING
      }
      if (cell.column) {
        cell.coordinates = [(cell.column - 1) * COLUMN_STEP_WIDTH + LAYOUT_BASIC_COORDINATE.LEFT, currentTop]
      }
    })
  })

  const newNodes = extendNodes.map((node) => {
    return {
      ...omit(node, 'column', 'row', 'style'),
    }
  })
  return { links: links, nodes: newNodes }
}

export const diffNodesCoordinates = (oldNodes: INodeType[], newNodes: INodeType[]) => {
  return newNodes.some(({ id, coordinates }) => {
    const find = oldNodes.find((item) => item.id === id)
    if (!find) {
      return true
    } else if (!isEqual(find.coordinates, coordinates)) {
      return true
    } else {
      return false
    }
  })
}

const toFixed2 = (num: number) => Number(num.toFixed(2))

export const computedAnimationStep = (
  oldNodes: INodeType[],
  newNodes: INodeType[],
  stepCount: number
): INodeTypeWithStep[] => {
  return oldNodes.map((node) => {
    const findNextNode = newNodes.find((item) => item.id === node.id)
    const xStep = findNextNode ? toFixed2((findNextNode.coordinates[0] - node.coordinates[0]) / stepCount) : 0
    const yStep = findNextNode ? toFixed2((findNextNode.coordinates[1] - node.coordinates[1]) / stepCount) : 0
    return {
      ...node,
      xStep,
      yStep,
    }
  })
}

interface INodeTypeWithStep extends INodeType {
  xStep: number
  yStep: number
}

interface IAutoLayoutAnimation {
  originNodes: INodeType[]
  futureNodes: INodeType[]
  animationFn: (nodes: INodeType[]) => void
  stepCount: number
}

export const autoLayoutAnimation = ({ originNodes, futureNodes, animationFn, stepCount }: IAutoLayoutAnimation) => {
  return new Promise((resolve, reject) => {
    try {
      let animationCount = 0
      let nodeWithStep: INodeTypeWithStep[] = computedAnimationStep(originNodes, futureNodes, stepCount)
      const step = () => {
        animationCount = animationCount + 1
        nodeWithStep = nodeWithStep.map((item) => {
          return {
            ...item,
            coordinates: [item.coordinates[0] + item.xStep, item.coordinates[1] + item.yStep],
          }
        })
        const nextNodes: INodeType[] = nodeWithStep.map((item) => ({ ...omit(item, ['xStep', 'yStep']) }))

        animationFn(nextNodes)

        if (animationCount < stepCount) {
          requestAnimationFrame(step)
        } else {
          animationFn(futureNodes) // 最后多执行一次保证位置正确
          resolve(futureNodes)
        }
      }
      requestAnimationFrame(step)
    } catch (error) {
      reject(error)
    }
  })
}
