import { ICoordinateType, IDiagramType, INodeType, IPasteLinkType, ITransform } from '../types'
import { v4 as uuidv4 } from 'uuid'
import { cloneDeep, minBy } from 'lodash-es'
import { getNodeStyle } from '.'

/*
 * 生成copy数据
 */
export const createCopyValue = (value: IDiagramType, activeNodeIds: string[]) => {
  const newNodes = value.nodes.filter((node) => activeNodeIds.includes(node.id))

  // 1. 找到原始 node 边界
  const minX = minBy(newNodes, 'coordinates[0]')?.coordinates[0] || 0
  const minY = minBy(newNodes, 'coordinates[1]')?.coordinates[1] || 0

  return {
    nodes: newNodes.map((node) => ({
      ...node,
      coordinates: [node.coordinates[0] - minX, node.coordinates[1] - minY],
    })),
    links: value.links,
  }
}

const updatePasteLink = (links: IPasteLinkType[], oldId: string, newId: string) =>
  links.map((link) => {
    const inputUpdated = link.input === oldId
    const outputUpdated = link.output === oldId
    return {
      ...link,
      input: inputUpdated ? newId : link.input,
      output: outputUpdated ? newId : link.output,
      inputUpdated: inputUpdated || link.inputUpdated,
      outputUpdated: outputUpdated || link.outputUpdated,
    }
  })

/*
 * 生成copy数据
 */
export const createPasteValue = (value: IDiagramType, offset: { x: number; y: number }) => {
  let newLinks: IPasteLinkType[] = value.links

  const newNodes = value.nodes.map((item) => {
    const newNodeId = uuidv4()
    const newCoordinates: ICoordinateType = [item.coordinates[0] + offset.x, item.coordinates[1] + offset.y]
    newLinks = updatePasteLink(newLinks, item.id, newNodeId)

    return {
      ...item,
      // 重新设置 node 坐标
      coordinates: newCoordinates,
      inputs: item.inputs.map((port) => {
        const newPortId = uuidv4()
        newLinks = updatePasteLink(newLinks, port.id, newPortId)

        return { ...port, id: newPortId }
      }),
      outputs: item.outputs.map((port) => {
        const newPortId = uuidv4()
        newLinks = updatePasteLink(newLinks, port.id, newPortId)

        return { ...port, id: newPortId }
      }),
      id: newNodeId,
    }
  })

  return {
    nodes: newNodes,
    links: newLinks
      .filter((link) => link.inputUpdated && link.outputUpdated)
      .map(({ inputUpdated, outputUpdated, ...link }) => ({ ...link })),
  }
}

/*
 * 计算在屏幕范围的中心位置，在 画布内的坐标
 */
export const calculatePasteOriginCoordination = (transform: ITransform, panelDom: HTMLDivElement) => {
  const { scale, translateX, translateY } = transform
  const { width, height } = getNodeStyle(panelDom)

  return {
    x: -translateX / scale + width / scale / 3,
    y: -translateY / scale + height / scale / 2,
  }
}

export const createSinglePasteValue = (originNode: INodeType): INodeType => {
  const nodeData = cloneDeep(originNode)

  return {
    ...nodeData,
    id: uuidv4(),
    outputs: nodeData.outputs.map((output) => ({
      id: uuidv4(),
      isLinked: false,
    })),
    inputs: nodeData.outputs.map((input) => ({
      id: uuidv4(),
      isLinked: false,
    })),
    coordinates: [nodeData.coordinates[0] + 20, nodeData.coordinates[1] + 20],
  }
}
