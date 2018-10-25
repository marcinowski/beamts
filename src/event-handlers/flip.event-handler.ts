import { EventHandlerInterface } from './types';
import { RootState } from '@/store/types';
import { Store } from 'vuex';
import {
  Coordinates,
  LineCoordinates,
  EventTypes,
  CustomEvent,
} from '@/types/types';
import { StoreApi } from '@/event-handlers/store-api';

enum States {
  BASE,
  END,
}

export class FlipEventHandler implements EventHandlerInterface {
  private storeApi: StoreApi;
  private baseCoordinates?: Coordinates;
  private currentState: States;

  constructor(store: Store<RootState>) {
    this.storeApi = new StoreApi(store);
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
    }
  }

  handleBaseEvent(event: CustomEvent, svgCoordinates: Coordinates) {
    if (this.currentState !== States.BASE || event.type !== EventTypes.CLICK) {
      return;
    }
    this.baseCoordinates = svgCoordinates;
    this.currentState = States.END;
  }

  handleEndEvent(event: CustomEvent, svgCoordinates: Coordinates) {
    if (this.currentState !== States.END || event.type !== EventTypes.CLICK) {
      return;
    }
    if (!this.baseCoordinates) {
      return;
    }
    const line: LineCoordinates = {
      start: this.baseCoordinates,
      end: svgCoordinates,
    };
    this.storeApi.flipSelected(line);
    this.baseCoordinates = undefined;
    this.currentState = States.BASE;
  }
}
