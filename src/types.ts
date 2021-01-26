export interface IPointType {
  id: string;
  disabled?: boolean;
}

export type ICoordinateType = [number, number];


export interface INodeType {
  id: string;
  type: 'node-type-input' | 'node-type-select';
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

export interface INodeItemProps<T> {
  value: T;
  onChange: (value: T) => void;
}
