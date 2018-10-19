export enum MethodTypes {
  ARC = 'arc',
  CURSOR = 'cursor',
  FLIP = 'flip',
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

export interface LineCoordinates {
  start: Coordinates;
  end: Coordinates;
}

export interface Line {
  id: number;
  p1: Point['id'];
  p2: Point['id'];
  selected: boolean;
}

export interface Arc extends Line {
  radius: number;
}

export interface Selection {
  x: number;
  y: number;
  height: number;
  width: number;
}

export interface Section {
  id: number;
  area: number;
  inertia: Coordinates;
}

export interface Material {
  id: number;
  young: number;
  poisson: number;
}
