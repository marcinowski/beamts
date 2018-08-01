export enum MethodTypes {
  CURSOR,
  SELECTION,
  POINT,
  RECTANGLE,
}

export interface Point {
  id: number;
  cx: number;
  cy: number;
  selected?: boolean;
}

export interface Line {
  id: number;
  p1: Point['id'];
  p2: Point['id'];
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface Selection {
  x: number;
  y: number;
  height: number;
  width: number;
}
