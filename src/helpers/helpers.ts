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

export function getPointIdFromEvent(event: Event): number {
  return event.timeStamp;
}

// TODO: This approach doesn't scale well, how about string based ids or UUID?
export function getLineIdFromEvent(event: Event): number {
  return getPointIdFromEvent(event) + 1;
}

export function getArcIdFromEvent(event: Event): number {
  return getPointIdFromEvent(event) + 2;
}
