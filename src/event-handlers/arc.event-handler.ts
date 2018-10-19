import { EventHandlerInterface } from './types';
import { RootState } from '@/store/types';
import { Store } from 'vuex';
import {
  Coordinates,
  Point,
  Arc,
  EventTypes,
  CustomEvent,
  ObjectTypes,
} from '@/types/types';
import { PointEventHandler } from '@/event-handlers/point.event-handler';
import {
  getVector,
  getVectorLength,
  getPointIdFromEvent,
  getArcIdFromEvent,
} from '@/helpers/helpers';

enum States {
  BASE,
  END,
  BASEARC,
  ENDARC,
}

export class ArcEventHandler implements EventHandlerInterface {
  private $store: Store<RootState>;
  private currentState: States;
  private pointHandler: PointEventHandler;
  private arcStart?: Coordinates;
  private baseId?: Point['id'];
  private endId?: Point['id'];

  constructor(store: Store<RootState>) {
    this.$store = store;
    this.pointHandler = new PointEventHandler(store);
    this.currentState = States.BASE;
  }

  handleEvent(event: CustomEvent, svgCoordinates: Coordinates) {
    switch (this.currentState) {
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

  handleBaseEvent(event: CustomEvent, svgCoordinates: Coordinates) {
    if (this.currentState !== States.BASE) {
      return;
    }
    if (
      event.customType === EventTypes.SELECTED_OBJECT &&
      event.sourceObject === ObjectTypes.POINT &&
      event.sourceId
    ) {
      this.baseId = event.sourceId;
    } else if (event.originalEvent.type === EventTypes.CLICK) {
      this.pointHandler.handleEvent(event, svgCoordinates);
      this.baseId = getPointIdFromEvent(event.originalEvent);
    } else {
      return;
    }
    this.currentState = States.END;
  }

  handleEndEvent(event: CustomEvent, svgCoordinates: Coordinates) {
    if (this.currentState !== States.END) {
      return;
    }
    if (!this.baseId) {
      this.currentState = States.BASE;
      return;
    }
    if (
      event.customType === EventTypes.SELECTED_OBJECT &&
      event.sourceObject === ObjectTypes.POINT &&
      event.sourceId
    ) {
      this.endId = event.sourceId;
    } else if (event.originalEvent.type === EventTypes.CLICK) {
      this.pointHandler.handleEvent(event, svgCoordinates);
      this.endId = getPointIdFromEvent(event.originalEvent);
    } else {
      return;
    }
    this.currentState = States.BASEARC;
  }

  handleBaseArcEvent(event: CustomEvent, svgCoordinates: Coordinates) {
    if (
      this.currentState !== States.BASEARC ||
      event.originalEvent.type !== EventTypes.MOUSEDOWN
    ) {
      return;
    }
    this.arcStart = svgCoordinates;
    this.currentState = States.ENDARC;
  }

  handleEndArcEvent(event: CustomEvent, svgCoordinates: Coordinates) {
    if (
      this.currentState !== States.ENDARC ||
      event.originalEvent.type !== EventTypes.MOUSEUP
    ) {
      // FIXME: There's an issue that the `click` event is immediately after
      // MOUSEUP, so the phase1 gets triggered immediately as well
      return;
    }
    if (!this.arcStart || !this.baseId || !this.endId) {
      throw Error('Undefined arc variable');
    }
    const vector = getVector(this.arcStart, svgCoordinates);
    const radius = getVectorLength(vector);
    const arc: Arc = {
      id: getArcIdFromEvent(event.originalEvent),
      radius,
      p1: this.baseId,
      p2: this.endId,
      selected: false,
    };
    this.$store.commit('svg/addArc', arc);
    this.baseId = undefined;
    this.endId = undefined;
    this.arcStart = undefined;
    this.currentState = States.BASE;
    return;
  }
}
