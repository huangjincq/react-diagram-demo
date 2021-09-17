export type NodeTypeEnum =
  | 'nodeTypeSingleOutputs'
  | 'nodeTypeSingleInputs'
  | 'nodeTypeCustomRenderPort'
  | 'nodeTypeNoInputOutput'
  | 'nodeTypeMultipleInputsOutputs'

/*
 * 坐标 数据类型
 * */
export type ICoordinateType = [number, number]

/*
 * port 数据类型
 * */
export interface IPointType {
  id: string
  isLinked?: boolean // 该点 是否已经被连接
}

/*
 * node 数据类型
 * */
export interface INodeType {
  id: string
  type: NodeTypeEnum // node 类型
  inputs: IPointType[] // node 输入点
  outputs: IPointType[] // node 输出点
  coordinates: ICoordinateType // [node left 值，node top 值]
  data: any // node 携带数据
}

/*
 * link 数据类型
 * */
export interface ILinkType {
  input: string // 起点 id
  output: string // 终点 id
}

/*
 * link 数据类型 粘贴的时候扩展两个字段
 * */
export interface IPasteLinkType {
  input: string // 起点 id
  output: string // 终点 id
  inputUpdated?: boolean
  outputUpdated?: boolean
}

/*
 *  数据类型
 * */
export interface IDiagramType {
  nodes: INodeType[] // 所有 node
  links: ILinkType[] // 所有 link
}

export interface ISegmentType {
  id: string
  from: ICoordinateType
  to: ICoordinateType
}

export interface IPortRefs {
  [id: string]: HTMLElement
}

export interface INodeRefs {
  [id: string]: HTMLDivElement
}

export interface ITransform {
  scale: number
  translateX: number
  translateY: number
}

export interface IMousePosition {
  x: number
  y: number
  relativeX: number
  relativeY: number
}

export interface ISelectionArea {
  left: number
  top: number
  width: number
  height: number
}

export interface INodeStyle {
  width: number
  height: number
  left: number
  top: number
  right: number
  bottom: number
}

export interface INodeItemProps<T> {
  value: T
  onChange: (value: T) => void
  inputs?: IPointType[]
  outputs?: IPointType[]
  nodeId: string
}
