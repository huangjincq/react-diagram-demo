import React, { useCallback } from 'react'
import { Link } from '../Link/Link'
import { ILinkType, INodeType, ICoordinateType } from '../../../types'
import { isEqual } from 'lodash-es'

interface LinkCanvasProps {
  nodes: INodeType[],
  links: ILinkType[]
  onChange: (value: ILinkType[]) => void
}

/**
 * Given an array of nodes and an id, returns the involved port/node
 */
interface EntityPutType {
  type: string;
  entity: {
    id: string;
    coordinates: ICoordinateType;
  }
}

const findInvolvedEntity = (nodes: INodeType[], entityId: string, type = 'node', coordinates?: ICoordinateType): EntityPutType | undefined => {
  if (!entityId || !nodes || nodes.length === 0) return undefined

  let result
  let index = 0

  while (index < nodes.length && !result) {
    const node = nodes[index]
    if (node.id === entityId) {
      // todo  add parentNode in port
      result = {type, entity: {coordinates: coordinates || node.coordinates, id: node.id}}
    } else {
      result =
        findInvolvedEntity(node.inputs as INodeType[], entityId, 'port', node.coordinates) ||
        findInvolvedEntity(node.outputs as INodeType[], entityId, 'port', node.coordinates)
    }

    index += 1
  }

  return result
}

export const LinksCanvas: React.FC<LinkCanvasProps> = React.memo((props) => {
  const {nodes, onChange, links} = props

  const removeFromLinksArray = useCallback((link) => {
    if (links.length > 0 && onChange) {
      const nextLinks = links.filter((item) => !isEqual(item, link))
      onChange(nextLinks)
    }
  }, [links, onChange])


  return (
    <svg className="bi bi-link-canvas-layer">
      {links && links.length > 0 && links.map((link) => (
        <Link
          link={link}
          input={findInvolvedEntity(nodes, link.input)}
          output={findInvolvedEntity(nodes, link.output)}
          onDelete={removeFromLinksArray}
          key={`${link.input}-${link.output}`}
        />
      ))}
    </svg>
  )
})
LinksCanvas.displayName = 'LinksCanvas'

