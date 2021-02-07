export interface IPointType {
  id: string;
  isLinked?: boolean;
}

export type ICoordinateType = [number, number];


export interface INodeType {
  id: string;
  type: 'nodeTypeInput' | 'nodeTypeSelect';
  inputs: IPointType[];
  outputs: IPointType[];
  coordinates: ICoordinateType;
  data: any;
}

export interface ILinkType {
  input: string;
  output: string;
}

export interface IDiagramType {
  nodes: INodeType[];
  links: ILinkType[];
}

export interface ISegmentType {
  id: string;
  from: ICoordinateType;
  to: ICoordinateType;
}

export interface IPortRefs {
  [id: string]: HTMLDivElement;
}

export interface INodeRefs {
  [id: string]: HTMLDivElement
}

export interface ITranslate {
  x:number;
  y:number;
}

export interface IMousePosition {
  x:number;
  y:number;
}



export interface INodeItemProps<T> {
  value: T;
  onChange: (value: T) => void;
}
