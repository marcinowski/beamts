import { EventHandlerInterface, EventTypes } from '@/event-handlers/types';
import { RootState } from '@/store/types';
import { Store } from 'vuex';
import { Coordinates, Point, Vector, Arc } from '@/types/types';
import { PointEventHandler } from '@/event-handlers/point.event-handler';

enum ArcStates {
  BASE,
  END,
  BASEARC,
  ENDARC,
}

export class ArcEventHandler implements EventHandlerInterface {
  private $store: Store<RootState>;
  private currentPhase: ArcStates;
  private pointHandler: PointEventHandler;
  private arcStart?: Coordinates;
  private baseId?: Point['id'];
  private endId?: Point['id'];

  constructor(store: Store<RootState>) {
    this.$store = store;
    this.pointHandler = new PointEventHandler(store);
    this.currentPhase = ArcStates.BASE;
  }

  handleEvent(event: MouseEvent, svgCoordinates: Coordinates) {
    switch (this.currentPhase) {
      case ArcStates.BASE:
        this.handleBaseEvent(event, svgCoordinates);
        return;
      case ArcStates.END:
        this.handleEndEvent(event, svgCoordinates);
        return;
      case ArcStates.BASEARC:
        this.handleBaseArcEvent(event, svgCoordinates);
        return;
      case ArcStates.ENDARC:
        this.handleEndArcEvent(event, svgCoordinates);
        return;
    }
  }

  handleBaseEvent(event: MouseEvent, svgCoordinates: Coordinates) {
    if (
      this.currentPhase !== ArcStates.BASE ||
      event.type !== EventTypes.CLICK
    ) {
      return;
    }
    this.pointHandler.handleEvent(event, svgCoordinates);
    this.baseId = event.timeStamp;
    this.currentPhase = ArcStates.END;
  }

  handleEndEvent(event: MouseEvent, svgCoordinates: Coordinates) {
    if (
      this.currentPhase !== ArcStates.END ||
      event.type !== EventTypes.CLICK
    ) {
      return;
    }
    this.pointHandler.handleEvent(event, svgCoordinates);
    this.endId = event.timeStamp;
    this.currentPhase = ArcStates.BASEARC;
  }

  handleBaseArcEvent(event: MouseEvent, svgCoordinates: Coordinates) {
    if (
      this.currentPhase !== ArcStates.BASEARC ||
      event.type !== EventTypes.MOUSEDOWN
    ) {
      return;
    }
    this.arcStart = svgCoordinates;
    this.currentPhase = ArcStates.ENDARC;
  }

  handleEndArcEvent(event: MouseEvent, svgCoordinates: Coordinates) {
    if (
      this.currentPhase !== ArcStates.ENDARC ||
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
    this.currentPhase = ArcStates.BASE;
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
