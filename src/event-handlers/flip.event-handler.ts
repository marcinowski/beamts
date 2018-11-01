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
    if (
      this.currentState !== States.BASE ||
      (event.type !== EventTypes.CLICK &&
        event.type !== EventTypes.SELECTED_OBJECT)
    ) {
      return this.initBaseState();
    }
    this.baseCoordinates = svgCoordinates;
    this.storeApi.setHelperLineStart(svgCoordinates);
    this.initEndState();
  }

  handleEndEvent(event: CustomEvent, svgCoordinates: Coordinates) {
    if (this.currentState !== States.END || !this.baseCoordinates) {
      return this.initBaseState();
    }
    if (
      event.type === EventTypes.CLICK ||
      event.type === EventTypes.SELECTED_OBJECT
    ) {
      const line: LineCoordinates = {
        start: this.baseCoordinates,
        end: svgCoordinates,
      };
      this.storeApi.flipSelected(line);
      this.initBaseState();
    } else if (event.type === EventTypes.MOUSEMOVE) {
      this.storeApi.setHelperLineEnd(svgCoordinates);
    } else {
      return;
    }
  }

  initBaseState() {
    this.baseCoordinates = undefined;
    this.storeApi.clearHelperLine();
    this.currentState = States.BASE;
    this.storeApi.addHelper(
      `Click on the workspace to set a first point of a reflection line.`,
      false,
    );
  }

  initEndState() {
    this.currentState = States.END;
    this.storeApi.addHelper(
      `Click on the workspace to set a second point of a reflection line.`,
      false,
    );
  }
}
