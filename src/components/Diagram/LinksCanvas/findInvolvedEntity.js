/**
 * Given an array of nodes and an id, returns the involved port/node
 */
const findInvolvedEntity = (nodes, entityId, type = 'node', parentNode = {}) => {
  if (!entityId || !nodes || nodes.length === 0) return undefined

  let result
  let index = 0

  while (index < nodes.length && !result) {
    const node = nodes[index]


    if (node.id === entityId) {
      // todo  add parentNode in port
      result = { type, entity: { ...parentNode, ...node } }
    } else {
      result = findInvolvedEntity(node.inputs, entityId, 'port', node) || findInvolvedEntity(node.outputs, entityId, 'port', node)
    }

    index += 1
  }

  return result
}

export default findInvolvedEntity
