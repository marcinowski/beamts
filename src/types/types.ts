export enum MethodTypes {
  CURSOR = 'cursor',
  LINE = 'line',
  MOVE = 'move',
  POINT = 'point',
  ROTATE = 'rotate',
  SELECTION = 'selection',
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface Vector {
  x: number;
  y: number;
}

export interface Rotation {
  origin: Coordinates;
  angle: number;
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
