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
    this.showHelper();
  }

  handleEvent(event: CustomEvent, svgCoordinates: Coordinates) {
    if (
      event.type === EventTypes.SELECTED_OBJECT &&
      event.sourceObject === ObjectTypes.POINT
    ) {
      return;
    } else if (event.type === EventTypes.CLICK) {
      this.storeApi.drawPoint(svgCoordinates, event);
    }
  }

  showHelper() {
    this.storeApi.addHelper(
      `Click on the workspace to add a point.
        You can also enter coordinates below in an X Y format.`,
      true,
    );
  }
}
