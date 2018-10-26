import { EventHandlerInterface } from './types';
import { RootState } from '@/store/types';
import { Store } from 'vuex';
import {
  Coordinates,
  LineCoordinates,
  EventTypes,
  CustomEvent,
} from '@/types/types';
import { getVector } from '@/helpers/helpers';
import { StoreApi } from '@/event-handlers/store-api';

export class SelectionEventHandler implements EventHandlerInterface {
  private storeApi: StoreApi;
  private baseCoordinates?: Coordinates;

  constructor(store: Store<RootState>) {
    this.storeApi = new StoreApi(store);
  }

  handleEvent(event: CustomEvent, svgCoordinates: Coordinates) {
    switch (event.type) {
      case EventTypes.MOUSEDOWN:
        this.handleBaseEvent(event, svgCoordinates);
        return;
      case EventTypes.MOUSEMOVE:
        this.handleDragEvent(event, svgCoordinates);
        return;
      case EventTypes.MOUSEUP:
        this.handleEndEvent(event, svgCoordinates);
        return;
    }
  }

  handleBaseEvent(event: CustomEvent, svgCoordinates: Coordinates) {
    if (event.type !== EventTypes.MOUSEDOWN) {
      return;
    }
    this.baseCoordinates = svgCoordinates;
    this.storeApi.setSelectionStart(svgCoordinates);
  }

  handleDragEvent(event: CustomEvent, svgCoordinates: Coordinates) {
    if (event.type !== EventTypes.MOUSEMOVE || !this.baseCoordinates) {
      return;
    }
    this.storeApi.setSelectionEnd(svgCoordinates);
  }

  handleEndEvent(event: CustomEvent, svgCoordinates: Coordinates) {
    if (event.type !== EventTypes.MOUSEUP || !this.baseCoordinates) {
      return;
    }
    const lineCoordinates: LineCoordinates = {
      start: this.baseCoordinates,
      end: svgCoordinates,
    };
    this.storeApi.selectObjects(lineCoordinates);
    this.baseCoordinates = undefined;
  }
}
