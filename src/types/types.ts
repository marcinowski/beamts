export enum MethodTypes {
  CURSOR = 'cursor',
  SELECTION = 'selection',
  POINT = 'point',
  LINE = 'line',
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface Point extends Coordinates {
  id: number;
  selected?: boolean;
}

export interface Line {
  id: number;
  p1: Point['id'];
  p2: Point['id'];
  selected: boolean;
}

export interface Selection {
  x: number;
  y: number;
  height: number;
  width: number;
}
