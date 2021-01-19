import getRelativePoint from '../../shared/functions/getRelativePoint'

/**
 * Return the coordinates of a given entity (node or port)
 */
const getEntityCoordinates = (entity, portRefs, nodeRefs, canvas) => {
  if (entity && entity.type === 'node' && nodeRefs[entity.entity.id]) {
    const nodeEl = nodeRefs[entity.entity.id]
    const bbox = nodeEl // .getBoundingClientRect();
    return [entity.entity.coordinates[0] + (bbox.width / 2), entity.entity.coordinates[1] + (bbox.height / 2)]
  }

  if (portRefs && portRefs[entity.entity.id]) {
    console.log(entity)
    const portEl = portRefs[entity.entity.id]
    const bbox = portEl // .getBoundingClientRect();

    return getRelativePoint([entity.entity.coordinates[0] + bbox.offsetX + (bbox.width / 2), entity.entity.coordinates[1] + bbox.offsetY + (bbox.height / 2)], [canvas.x, canvas.y])
  }

  return undefined
}

export default getEntityCoordinates
