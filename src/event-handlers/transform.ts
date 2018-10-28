import { RootState } from '@/store/types';
import { Store } from 'vuex';
import {
  Point,
  LineCoordinates,
  Arc,
  Coordinates,
  Line,
  Vector,
  Rotation,
} from '@/types/types';

export class Transform {
  private $store: Store<RootState>;

  constructor(store: Store<RootState>) {
    this.$store = store;
  }

  private get unit(): number {
    return this.$store.getters['config/getScaledUnit'];
  }

  private get density(): number {
    return this.$store.getters['config/getScaledDensity'];
  }

  numberToAbsolute(n: number): number {
    return (n - (n % this.density)) / this.unit;
  }

  numberFromAbsolute(n: number): number {
    return n * this.unit;
  }

  coordinatesToAbsolute(coordinates: Coordinates): Coordinates {
    return {
      x: this.numberToAbsolute(coordinates.x),
      y: this.numberToAbsolute(coordinates.y),
    };
  }

  coordinatesFromAbsolute(coordinates: Coordinates): Coordinates {
    return {
      x: coordinates.x * this.unit,
      y: coordinates.y * this.unit,
    };
  }

  pointToAbsolute(point: Point): Point {
    const { x, y } = point;
    return {
      ...point,
      ...this.coordinatesToAbsolute({ x, y }),
    };
  }

  pointFromAbsolute(point: Point): Point {
    const { x, y } = point;
    return {
      ...point,
      ...this.coordinatesFromAbsolute({ x, y }),
    };
  }

  lineToAbsolute(line: Line): Line {
    return line;
  }

  lineFromAbsolute(line: Line): Line {
    return line;
  }

  arcToAbsolute(arc: Arc): Arc {
    return {
      ...arc,
      radius: this.numberToAbsolute(arc.radius),
    };
  }

  arcFromAbsolute(arc: Arc): Arc {
    return {
      ...arc,
      radius: this.numberFromAbsolute(arc.radius),
    };
  }

  lineCoordinatesToAbsolute(line: LineCoordinates): LineCoordinates {
    return {
      ...line,
      start: this.coordinatesToAbsolute(line.start),
      end: this.coordinatesToAbsolute(line.end),
    };
  }

  lineCoordinatesFromAbsolute(line: LineCoordinates): LineCoordinates {
    return {
      ...line,
      start: this.coordinatesFromAbsolute(line.start),
      end: this.coordinatesFromAbsolute(line.end),
    };
  }

  vectorToAbsolute(vector: Vector): Vector {
    return {
      ...vector,
      x: this.numberToAbsolute(vector.x),
      y: this.numberToAbsolute(vector.y),
    };
  }

  vectorFromAbsolute(vector: Vector): Vector {
    return {
      ...vector,
      x: this.numberFromAbsolute(vector.x),
      y: this.numberFromAbsolute(vector.y),
    };
  }

  rotationToAbsolute(rotation: Rotation): Rotation {
    return {
      ...rotation,
      origin: this.coordinatesToAbsolute(rotation.origin),
    };
  }

  rotationFromAbsolute(rotation: Rotation): Rotation {
    return {
      ...rotation,
      origin: this.coordinatesFromAbsolute(rotation.origin),
    };
  }
}
