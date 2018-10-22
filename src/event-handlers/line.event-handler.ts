import { EventHandlerInterface } from './types';
import { RootState } from '@/store/types';
import { Store } from 'vuex';
import {
  Coordinates,
  Point,
  Line,
  EventTypes,
  CustomEvent,
  ObjectTypes,
} from '@/types/types';
import { getPointIdFromEvent, getLineIdFromEvent } from '@/helpers/helpers';
import { StoreApi } from '@/event-handlers/store-api';

enum States {
  BASE,
  END,
}

export class LineEventHandler implements EventHandlerInterface {
  private $store: Store<RootState>;
  private storeApi: StoreApi;
  private currentState: States;
  private baseId?: Point['id'];

  constructor(store: Store<RootState>) {
    this.$store = store;
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
      this.storeApi.drawPoint(svgCoordinates, event);
      this.baseId = getPointIdFromEvent(event.originalEvent);
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
    let endId;
    if (
      event.customType === EventTypes.SELECTED_OBJECT &&
      event.sourceObject === ObjectTypes.POINT &&
      event.sourceId
    ) {
      endId = event.sourceId;
    } else if (event.originalEvent.type === EventTypes.CLICK) {
      this.storeApi.drawPoint(svgCoordinates, event);
      endId = getPointIdFromEvent(event.originalEvent);
    } else {
      return;
    }
    const line: Line = {
      p1: this.baseId,
      p2: endId,
      id: getLineIdFromEvent(event.originalEvent),
      selected: false,
    };
    this.$store.commit('svg/addLine', line);
    this.baseId = undefined;
    this.initBaseState();
  }

  initBaseState() {
    this.currentState = States.BASE;
    this.$store.commit('helpers/addHelper', {
      description: `Click on the workspace to add the first point of a line.
        You can also enter coordinates below in an X Y format.`,
      showInput: true,
    });
  }

  initEndState() {
    this.currentState = States.END;
    this.$store.commit('helpers/addHelper', {
      description: `Click on the workspace to add the last point of a line.
        You can also enter coordinates below in an X Y format.`,
      showInput: true,
    });
  }
}
