import { EventHandlerInterface } from './types';
import { RootState } from '@/store/types';
import { Store } from 'vuex';
import { Coordinates, EventTypes, CustomEvent } from '@/types/types';
import { getVector } from '@/helpers/helpers';
import { StoreApi } from '@/event-handlers/store-api';

enum States {
  BASE,
  END,
}

export class MoveEventHandler implements EventHandlerInterface {
  private storeApi: StoreApi;
  private baseCoordinates?: Coordinates;
  private currentState: States;

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
      event.type === EventTypes.CLICK ||
      event.type === EventTypes.SELECTED_OBJECT
    ) {
      this.baseCoordinates = svgCoordinates;
      this.storeApi.setHelperLineStart(svgCoordinates);
      this.initEndState();
    }
  }

  handleEndEvent(event: CustomEvent, svgCoordinates: Coordinates) {
    if (this.currentState !== States.END || !this.baseCoordinates) {
      return;
    }
    if (
      event.type === EventTypes.CLICK ||
      event.type === EventTypes.SELECTED_OBJECT
    ) {
      const vector = getVector(this.baseCoordinates, svgCoordinates);
      this.storeApi.moveSelected(vector);
      this.initBaseState();
    } else if (event.type === EventTypes.MOUSEMOVE) {
      this.storeApi.setHelperLineEnd(svgCoordinates);
    }
  }

  initBaseState() {
    this.storeApi.clearHelperLine();
    this.baseCoordinates = undefined;
    this.currentState = States.BASE;
  }

  initEndState() {
    this.currentState = States.END;
  }
}
