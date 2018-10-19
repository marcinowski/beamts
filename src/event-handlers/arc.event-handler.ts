import { EventHandlerInterface, EventTypes } from '@/event-handlers/types';
import { RootState } from '@/store/types';
import { Store } from 'vuex';
import { Coordinates, Point, Vector, Arc } from '@/types/types';
import { PointEventHandler } from '@/event-handlers/point.event-handler';

enum States {
  BASE,
  END,
  BASEARC,
  ENDARC,
}

export class ArcEventHandler implements EventHandlerInterface {
  private $store: Store<RootState>;
  private currentPhase: States;
  private pointHandler: PointEventHandler;
  private arcStart?: Coordinates;
  private baseId?: Point['id'];
  private endId?: Point['id'];

  constructor(store: Store<RootState>) {
    this.$store = store;
    this.pointHandler = new PointEventHandler(store);
    this.currentPhase = States.BASE;
  }

  handleEvent(event: MouseEvent, svgCoordinates: Coordinates) {
    switch (this.currentPhase) {
      case States.BASE:
        this.handleBaseEvent(event, svgCoordinates);
        return;
      case States.END:
        this.handleEndEvent(event, svgCoordinates);
        return;
      case States.BASEARC:
        this.handleBaseArcEvent(event, svgCoordinates);
        return;
      case States.ENDARC:
        this.handleEndArcEvent(event, svgCoordinates);
        return;
    }
  }

  handleBaseEvent(event: MouseEvent, svgCoordinates: Coordinates) {
    if (this.currentPhase !== States.BASE || event.type !== EventTypes.CLICK) {
      return;
    }
    this.pointHandler.handleEvent(event, svgCoordinates);
    this.baseId = event.timeStamp;
    this.currentPhase = States.END;
  }

  handleEndEvent(event: MouseEvent, svgCoordinates: Coordinates) {
    if (this.currentPhase !== States.END || event.type !== EventTypes.CLICK) {
      return;
    }
    this.pointHandler.handleEvent(event, svgCoordinates);
    this.endId = event.timeStamp;
    this.currentPhase = States.BASEARC;
  }

  handleBaseArcEvent(event: MouseEvent, svgCoordinates: Coordinates) {
    if (
      this.currentPhase !== States.BASEARC ||
      event.type !== EventTypes.MOUSEDOWN
    ) {
      return;
    }
    this.arcStart = svgCoordinates;
    this.currentPhase = States.ENDARC;
  }

  handleEndArcEvent(event: MouseEvent, svgCoordinates: Coordinates) {
    if (
      this.currentPhase !== States.ENDARC ||
      event.type !== EventTypes.MOUSEUP
    ) {
      // FIXME: There's an issue that the `click` event is immediately after
      // MOUSEUP, so the phase1 gets triggered immediately as well
      return;
    }
    if (!this.arcStart || !this.baseId || !this.endId) {
      throw Error('Undefined arc variable');
    }
    const vector = this.getVector(this.arcStart, svgCoordinates);
    const radius = this.getVectorLength(vector);
    const arc: Arc = {
      id: event.timeStamp + 2,
      radius,
      p1: this.baseId,
      p2: this.endId,
      selected: false,
    };
    this.$store.commit('svg/addArc', arc);
    this.baseId = undefined;
    this.endId = undefined;
    this.arcStart = undefined;
    this.currentPhase = States.BASE;
    return;
  }

  getVector(start: Coordinates, end: Coordinates): Vector {
    return {
      x: end.x - start.x,
      y: end.y - start.y,
    };
  }

  getVectorLength(vector: Vector) {
    return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  }
}
