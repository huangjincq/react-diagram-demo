import React, {useCallback} from 'react'
import {Link} from '../Link/Link'
import findInvolvedEntity from './findInvolvedEntity'
import {ILinkType, INodeType} from '../../../types'
import {isEqual} from "lodash-es";

interface LinkCanvasProps {
  nodes: INodeType[],
  links: ILinkType[]
  onChange: (value: ILinkType[]) => void
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

