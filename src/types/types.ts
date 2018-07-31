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
}

export interface Line {
  id: number;
  p1: Point['id'];
  p2: Point['id'];
}
