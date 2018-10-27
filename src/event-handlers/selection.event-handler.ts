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

export class SelectionEventHandler implements EventHandlerInterface {
  private storeApi: StoreApi;
  private baseCoordinates?: Coordinates;

  constructor(store: Store<RootState>) {
    this.storeApi = new StoreApi(store);
  }

  handleEvent(event: CustomEvent, svgCoordinates: Coordinates) {
    switch (event.type) {
      case EventTypes.KEY_ESC:
        return this.handleEscEvent();
      case EventTypes.KEY_DELETE:
        return this.handleDeleteEvent();
      case EventTypes.MOUSEDOWN:
        return this.handleBaseEvent(svgCoordinates);
      case EventTypes.MOUSEMOVE:
        return this.handleDragEvent(svgCoordinates);
      case EventTypes.MOUSEUP:
        return this.handleEndEvent(svgCoordinates);
    }
  }

  handleBaseEvent(svgCoordinates: Coordinates) {
    this.baseCoordinates = svgCoordinates;
    this.storeApi.setSelectionStart(svgCoordinates);
  }

  handleDragEvent(svgCoordinates: Coordinates) {
    if (!this.baseCoordinates) {
      return;
    }
    this.storeApi.setSelectionEnd(svgCoordinates);
  }

  handleEndEvent(svgCoordinates: Coordinates) {
    if (!this.baseCoordinates) {
      return;
    }
    const lineCoordinates: LineCoordinates = {
      start: this.baseCoordinates,
      end: svgCoordinates,
    };
    this.storeApi.selectObjects(lineCoordinates);
    this.storeApi.clearSelection();
    this.baseCoordinates = undefined;
  }

  handleEscEvent() {
    this.storeApi.clearSelection();
  }

  handleDeleteEvent() {
    this.storeApi.removeSelected();
  }
}
