import { Coordinates, Vector } from '@/types/types';

export function getVector(start: Coordinates, end: Coordinates): Vector {
  return {
    x: end.x - start.x,
    y: end.y - start.y,
  };
}

export function getVectorLength(vector: Vector) {
  return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
}

export function getAngle(start: Coordinates, end: Coordinates): number {
  return Math.atan2(end.y - start.y, end.x - start.x);
}
