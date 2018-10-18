import { Coordinates, MethodTypes } from '@/types/types';
import { Store } from 'vuex';
import { RootState } from '@/store/types';
import { EventHandlerInterface } from '@/event-handlers/types';
import { LineEventHandler } from '@/event-handlers/line.event-handler';
import { PointEventHandler } from '@/event-handlers/point.event-handler';
import { ArcEventHandler } from '@/event-handlers/arc.event-handler';
import { CursorEventHandler } from '@/event-handlers/cursor.event-handler';
import { FlipEventHandler } from '@/event-handlers/flip.event-handler';
import { RotateEventHandler } from '@/event-handlers/rotate.event-handler';
import { SelectionEventHandler } from '@/event-handlers/selection.event-handler';
import { MoveEventHandler } from '@/event-handlers/move.event-handler';
import { svg } from '@/store/svg';

export class EventHandler implements EventHandlerInterface {
  handler: any;
  method: MethodTypes;
  private $store: Store<RootState>;

  constructor(store: Store<RootState>) {
    this.$store = store;
  }

  handleEvent(event: MouseEvent, svgCoordinates: Coordinates) {
    const method = this.$store.getters.getMethod;
    if (!this.method || this.method !== method) {
      this.method = method;
      this.handler = this.selectHandler(method);
    }
    this.handler.handleEvent(event, svgCoordinates);
  }

  selectHandler(method: MethodTypes): EventHandlerInterface {
    switch (method) {
      case MethodTypes.ARC:
        return new ArcEventHandler(this.$store);
      case MethodTypes.CURSOR:
        return new CursorEventHandler(this.$store);
      case MethodTypes.FLIP:
        return new FlipEventHandler(this.$store);
      case MethodTypes.LINE:
        return new LineEventHandler(this.$store);
      case MethodTypes.MOVE:
        return new MoveEventHandler(this.$store);
      case MethodTypes.POINT:
        return new PointEventHandler(this.$store);
      case MethodTypes.ROTATE:
        return new RotateEventHandler(this.$store);
      case MethodTypes.SELECTION:
        return new SelectionEventHandler(this.$store);
      default:
        throw Error(`Missing handler for method ${method}`);
    }
  }
}
