import { EventHandlerInterface } from './types';
import { RootState } from '@/store/types';
import { Store } from 'vuex';
import {
  Coordinates,
  Point,
  EventTypes,
  CustomEvent,
  ObjectTypes,
  ObjectId,
} from '@/types/types';
import {
  getVector,
  getVectorLength,
  getPointIdFromEvent,
} from '@/helpers/helpers';
import { StoreApi } from '@/event-handlers/store-api';

enum States {
  BASE,
  END,
  BASEARC,
  ENDARC,
}

export class ArcEventHandler implements EventHandlerInterface {
  private currentState: States;
  private arcStart?: Coordinates;
  private baseId?: ObjectId;
  private endId?: ObjectId;
  private storeApi: StoreApi;

  constructor(store: Store<RootState>) {
    this.storeApi = new StoreApi(store);
    this.initBaseState();
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
      event.type === EventTypes.SELECTED_OBJECT &&
      event.sourceObject === ObjectTypes.POINT &&
      event.sourceId
    ) {
      this.baseId = event.sourceId;
    } else if (event.type === EventTypes.CLICK) {
      this.storeApi.drawPoint(svgCoordinates, event);
      this.baseId = getPointIdFromEvent(event);
    } else {
      return;
    }
    this.initEndState();
  }

  handleEndEvent(event: CustomEvent, svgCoordinates: Coordinates) {
    if (this.currentState !== States.END) {
      return;
    }
    if (!this.baseId) {
      this.initBaseState();
      return;
    }
    if (
      event.type === EventTypes.SELECTED_OBJECT &&
      event.sourceObject === ObjectTypes.POINT &&
      event.sourceId
    ) {
      this.endId = event.sourceId;
    } else if (event.type === EventTypes.CLICK) {
      this.storeApi.drawPoint(svgCoordinates, event);
      this.endId = getPointIdFromEvent(event);
    } else {
      return;
    }
    this.initBaseArcState();
  }

  handleBaseArcEvent(event: CustomEvent, svgCoordinates: Coordinates) {
    if (
      this.currentState !== States.BASEARC ||
      event.type !== EventTypes.MOUSEDOWN
    ) {
      return;
    }
    this.arcStart = svgCoordinates;
    this.initEndArcState();
  }

  handleEndArcEvent(event: CustomEvent, svgCoordinates: Coordinates) {
    if (
      this.currentState !== States.ENDARC ||
      event.type !== EventTypes.MOUSEUP
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
    this.storeApi.drawArc(event, radius, this.baseId, this.endId);
    this.baseId = undefined;
    this.endId = undefined;
    this.arcStart = undefined;
    this.initBaseState();
    return;
  }

  initBaseState() {
    this.changeCurrentState(
      States.BASE,
      `Click on the workspace to add a first point of an arc.
        You can also enter coordinates below in an X Y format.`,
      true,
    );
  }

  initEndState() {
    this.changeCurrentState(
      States.END,
      `Click on the workspace to add a second point of an arc.
        You can also enter coordinates below in an X Y format`,
      true,
    );
  }

  initBaseArcState() {
    this.changeCurrentState(
      States.BASEARC,
      `Click on the workspace and drag to specify the length of arc's radius.
        You can also enter the radius below.`,
      true,
    );
  }

  initEndArcState() {
    this.changeCurrentState(
      States.ENDARC,
      `Finish the drag to specify the length of arc's radius.`,
    );
  }

  changeCurrentState(
    state: States,
    helperText: string,
    helperShowInput: boolean = false,
  ) {
    this.currentState = state;
    this.storeApi.addHelper(helperText, helperShowInput);
  }
}
