/**
 * Return the coordinates of a given entity (node or port)
 */
const getEntityCoordinates = (entity, portRefs, nodeRefs, canvas) => {
  if (entity && entity.type === 'node' && nodeRefs[entity.entity.id]) {
    const nodeEl = nodeRefs[entity.entity.id]
    const bbox = nodeEl // .getBoundingClientRect();
    return [entity.entity.coordinates[0] + bbox.width / 2, entity.entity.coordinates[1] + bbox.height / 2]
  }

  if (portRefs && portRefs[entity.entity.id]) {
    const portDom = portRefs[entity.entity.id]
    const parentNodeCoordinates = entity.parentNodeInfo.coordinates

    const result = [
      parentNodeCoordinates[0] + portDom.offsetLeft + portDom.offsetWidth / 2,
      parentNodeCoordinates[1] + portDom.offsetTop + portDom.offsetHeight / 2,
    ]

    return result
  }

  return undefined
}

export default getEntityCoordinates
