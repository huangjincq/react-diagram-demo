import React, {useMemo, useState} from 'react'
import {Button, Popover} from "antd";

import "./style.scss"
import {NodeListItem} from "./NodeListItem";

export interface NodeListProps {

}


export const NodeList: React.FC<NodeListProps> = ({}) => {


  return (
    <div className="node-list">
      <NodeListItem/>
      <NodeListItem/>
      <NodeListItem/>
    </div>
  )
}

NodeList.displayName = 'NodeList'
