export enum MethodTypes {
  CURSOR,
  SELECTION,
  POINT,
  LINE,
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
}

export interface Selection {
  x: number;
  y: number;
  height: number;
  width: number;
}
