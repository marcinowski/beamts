import { EventHandlerInterface } from './types';
import { RootState } from '@/store/types';
import { Store } from 'vuex';
import {
  Coordinates,
  EventTypes,
  CustomEvent,
  ObjectTypes,
  ObjectId,
} from '@/types/types';
import { getPointIdFromEvent } from '@/helpers/helpers';
import { StoreApi } from '@/event-handlers/store-api';

enum States {
  BASE,
  END,
}

export class LineEventHandler implements EventHandlerInterface {
  private storeApi: StoreApi;
  private currentState: States;
  private baseId?: ObjectId;

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
    let endId;
    if (
      event.type === EventTypes.SELECTED_OBJECT &&
      event.sourceObject === ObjectTypes.POINT &&
      event.sourceId &&
      event.sourceId !== this.baseId
    ) {
      endId = event.sourceId;
    } else if (event.type === EventTypes.CLICK) {
      this.storeApi.drawPoint(svgCoordinates, event);
      endId = getPointIdFromEvent(event);
    } else if (event.type === EventTypes.KEY_ESC) {
      this.baseId = undefined;
      this.initBaseState();
      return;
    } else {
      return;
    }
    this.storeApi.drawLine(event, this.baseId, endId);
    if (this.storeApi.isContinuousLine()) {
      this.baseId = endId;
    } else {
      this.baseId = undefined;
      this.initBaseState();
    }
  }

  initBaseState() {
    this.currentState = States.BASE;
    this.storeApi.addHelper(
      `Click on the workspace to add the first point of a line.
        You can also enter coordinates below in an X Y format.`,
      true,
    );
  }

  initEndState() {
    this.currentState = States.END;
    this.storeApi.addHelper(
      `Click on the workspace to add the last point of a line.
        You can also enter coordinates below in an X Y format.`,
      true,
    );
  }
}
