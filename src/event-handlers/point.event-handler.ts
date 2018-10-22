import { EventHandlerInterface } from './types';
import { RootState } from '@/store/types';
import { Store } from 'vuex';
import {
  Coordinates,
  EventTypes,
  CustomEvent,
  ObjectTypes,
} from '@/types/types';
import { StoreApi } from '@/event-handlers/store-api';

export class PointEventHandler implements EventHandlerInterface {
  private storeApi: StoreApi;

  constructor(store: Store<RootState>) {
    this.storeApi = new StoreApi(store);
  }

  handleEvent(event: CustomEvent, svgCoordinates: Coordinates) {
    if (
      event.customType === EventTypes.SELECTED_OBJECT &&
      event.sourceObject === ObjectTypes.POINT
    ) {
      return;
    } else if (event.originalEvent.type === EventTypes.CLICK) {
      this.storeApi.drawPoint(svgCoordinates, event);
    }
  }
}
