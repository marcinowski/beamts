import { EventHandlerInterface, EventTypes } from '@/event-handlers/types';
import { RootState } from '@/store/types';
import { Store } from 'vuex';
import { Coordinates, Point, Line } from '@/types/types';
import { PointEventHandler } from '@/event-handlers/point.event-handler';

enum States {
  BASE,
  END,
}

export class LineEventHandler implements EventHandlerInterface {
  private $store: Store<RootState>;
  private currentPhase: States;
  private pointHandler: PointEventHandler;
  private baseId?: Point['id'];

  constructor(store: Store<RootState>) {
    this.$store = store;
    this.pointHandler = new PointEventHandler(store);
    this.currentPhase = States.BASE;
  }

  handleEvent(event: MouseEvent, svgCoordinates: Coordinates) {
    switch (this.currentPhase) {
      case States.BASE:
        this.handleBaseEvent(event, svgCoordinates);
        return;
      case States.END:
        this.handleEndEvent(event, svgCoordinates);
        return;
    }
  }

  handleBaseEvent(event: MouseEvent, svgCoordinates: Coordinates) {
    if (this.currentPhase !== States.BASE || event.type !== EventTypes.CLICK) {
      return;
    }
    this.pointHandler.handleEvent(event, svgCoordinates);
    this.baseId = event.timeStamp;
    this.currentPhase = States.END;
  }

  handleEndEvent(event: MouseEvent, svgCoordinates: Coordinates) {
    if (this.currentPhase !== States.END || event.type !== EventTypes.CLICK) {
      return;
    }
    if (!this.baseId) {
      return;
    }
    this.pointHandler.handleEvent(event, svgCoordinates);
    const line: Line = {
      p1: this.baseId,
      p2: event.timeStamp,
      id: event.timeStamp + 1,
      selected: false,
    };
    this.$store.commit('svg/addLine', line);
    this.baseId = undefined;
    this.currentPhase = States.BASE;
  }
}
