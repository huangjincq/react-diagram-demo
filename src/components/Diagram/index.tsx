import React, { useCallback, useState, useRef } from 'react'
import { DiagramCanvas } from './DiagramCanvas'
import { NodesCanvas } from './NodesCanvas'
import { LinksCanvas } from './LinksCanvas'
import { Segment } from './Segment'

import './style.scss'
import { IDiagramType, ILinkType, ISegmentType, IPortRefs, INodeRefs } from "../../types"

interface DiagramProps {
  value: IDiagramType,
  onChange: (value: IDiagramType) => void;
  onAddHistory: any;
  scale: number
}

export const Diagram: React.FC<DiagramProps> = React.memo((props) => {
  const {value, onChange, onAddHistory, scale,} = props
  const [segment, setSegment] = useState<ISegmentType | undefined>()
  const {current: portRefs} = useRef<IPortRefs>({}) // keeps the port elements references
  const {current: nodeRefs} = useRef<INodeRefs>({}) // keeps the node elements references


  // when nodes change, performs the onChange callback with the new incoming data
  const onNodesChange = (nextNodes: any) => {
    if (onChange) {
      onChange({...value, nodes: nextNodes})
    }
  }

  // when a port is registered, save it to the local reference
  const onPortRegister = (portId: string, portEl: HTMLDivElement) => {
    portRefs[portId] = portEl
  }

  // when a node is registered, save it to the local reference
  const onNodeRegister = (nodeId: string, nodeEl: HTMLDivElement) => {
    // const rect = nodeEl.getBoundingClientRect()
    nodeRefs[nodeId] = nodeEl
  }

  // when a node is deleted, remove its references
  const onNodeRemove = useCallback((nodeId, inputsPorts, outputsPorts) => {
    delete nodeRefs[nodeId]
    inputsPorts.forEach((input: string) => delete portRefs[input])
    outputsPorts.forEach((output: string) => delete portRefs[output])
  }, [])

  // when a new segment is dragged, save it to the local state
  const onDragNewSegment = useCallback((portId, from, to) => {
    setSegment({id: `segment-${portId}`, from, to})
  }, [])

  // when a segment fails to connect, reset the segment state
  const onSegmentFail = useCallback(() => {
    setSegment(undefined)
  }, [])

  // when a segment connects, update the links schema, perform the onChange callback
  // with the new data, then reset the segment state
  const onSegmentConnect = (input: string, output: string) => {
    const nextLinks = [...value.links, {input, output}]
    onChange({...value, links: nextLinks})
    setSegment(undefined)
  }

  // when links change, performs the onChange callback with the new incoming data
  const onLinkDelete = (nextLinks: ILinkType[]) => {
    onChange({...value, links: nextLinks})
  }

  return (
    <DiagramCanvas portRefs={portRefs} nodeRefs={nodeRefs} scale={scale}>
      <NodesCanvas
        scale={scale}
        nodes={value.nodes}
        onChange={onNodesChange}
        onNodeRegister={onNodeRegister}
        onPortRegister={onPortRegister}
        onNodeRemove={onNodeRemove}
        onDragNewSegment={onDragNewSegment}
        onSegmentFail={onSegmentFail}
        onSegmentConnect={onSegmentConnect}
        onAddHistory={onAddHistory}
      />
      <LinksCanvas nodes={value.nodes} links={value.links} onChange={onLinkDelete}/>
      {segment && (
        <Segment segment={segment}/>
      )}
    </DiagramCanvas>
  )
})
