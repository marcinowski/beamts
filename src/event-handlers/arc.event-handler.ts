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
import {
  getVector,
  getVectorLength,
  getPointIdFromEvent,
  get2DCrossProduct,
} from '@/helpers/helpers';
import { StoreApi } from '@/event-handlers/store-api';

enum States {
  BASE,
  END,
  ARC,
}

export class ArcEventHandler implements EventHandlerInterface {
  private currentState: States;
  private storeApi: StoreApi;
  private start?: Coordinates;
  private end?: Coordinates;
  private lineA?: number;
  private lineB?: number;
  private baseId?: ObjectId;
  private endId?: ObjectId;

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
      case States.ARC:
        this.handleArcEvent(event, svgCoordinates);
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
    this.start = svgCoordinates;
    this.initEndState();
  }

  handleEndEvent(event: CustomEvent, svgCoordinates: Coordinates) {
    if (this.currentState !== States.END) {
      return;
    }
    if (!this.baseId || !this.start) {
      this.initBaseState();
      return;
    }
    if (
      event.type === EventTypes.SELECTED_OBJECT &&
      event.sourceObject === ObjectTypes.POINT &&
      event.sourceId &&
      event.sourceId !== this.baseId
    ) {
      this.endId = event.sourceId;
    } else if (event.type === EventTypes.CLICK) {
      this.storeApi.drawPoint(svgCoordinates, event);
      this.endId = getPointIdFromEvent(event);
    } else {
      return;
    }
    const { a, b } = this.calculateLine(this.start, svgCoordinates);
    this.lineA = a;
    this.lineB = b;
    this.end = svgCoordinates;
    this.storeApi.setHelperArcBase({ start: this.start, end: svgCoordinates });
    this.storeApi.setHelperLineStart(svgCoordinates);
    this.initArcState();
  }

  handleArcEvent(event: CustomEvent, svgCoordinates: Coordinates) {
    if (this.currentState !== States.ARC) {
      return;
    }
    if (
      !this.lineA ||
      !this.lineB ||
      !this.start ||
      !this.end ||
      !this.baseId ||
      !this.endId
    ) {
      return;
    }
    if (
      event.type === EventTypes.MOUSEMOVE ||
      event.type === EventTypes.SELECTED_OBJECT ||
      event.type === EventTypes.CLICK
    ) {
      const centerCoords = this.calculateCenterCoords(svgCoordinates);
      const radius = getVectorLength(getVector(this.start, centerCoords));
      this.storeApi.setHelperLineEnd(centerCoords);
      const startVector = getVector(centerCoords, this.start);
      const endVector = getVector(this.start, this.end);
      const sweep = get2DCrossProduct(startVector, endVector) > 0 ? 1 : 0;
      const largeArc = 0;
      if (event.type === EventTypes.MOUSEMOVE) {
        this.storeApi.setHelperArcEnd(radius, 0, sweep, largeArc);
      } else if (
        event.type === EventTypes.SELECTED_OBJECT ||
        event.type === EventTypes.CLICK
      ) {
        this.storeApi.drawArc(
          event,
          radius,
          this.baseId,
          this.endId,
          sweep,
          largeArc,
        );
        this.storeApi.clearHelperArc();
        this.storeApi.clearHelperLine();
        this.initBaseState();
      }
    } else if (event.type === EventTypes.KEY_ESC) {
      this.storeApi.clearHelperArc();
      this.storeApi.clearHelperLine();
      this.initBaseState();
    } else {
      return;
    }
  }

  // calculates line perpendicular to the base line on which the center must be
  // TODO: move to helpers
  calculateLine(start: Coordinates, end: Coordinates) {
    const a = (end.x - start.x) / (start.y - end.y);
    const b =
      (start.x ** 2 - end.x ** 2 + start.y ** 2 - end.y ** 2) /
      2 /
      (start.y - end.y);
    return { a, b };
  }

  // this uses 3rd point as arc's center
  calculateCenterCoords(coords: Coordinates): Coordinates {
    if (!this.lineA || !this.lineB || !this.start) {
      throw Error('Umm');
    }
    const a = -1 / this.lineA;
    const b = coords.y - coords.x * a;
    const x = (b - this.lineB) / (this.lineA - a);
    const y = a * x + b;
    return { x, y };
  }

  initBaseState() {
    this.lineA = undefined;
    this.lineB = undefined;
    this.start = undefined;
    this.end = undefined;
    this.baseId = undefined;
    this.endId = undefined;
    this.changeCurrentState(
      States.BASE,
      `Click on the workspace to add a first point of an arc.
        You can also enter coordinates below in an X Y format.`,
      true,
    );
  }

  initEndState() {
    this.changeCurrentState(
      States.END,
      `Click on the workspace to add a second point of an arc.
        You can also enter coordinates below in an X Y format`,
      true,
    );
  }

  initArcState() {
    this.changeCurrentState(
      States.ARC,
      `Click on the workspace and drag to specify the length of arc's radius.
        You can also enter the radius below.`,
      true,
    );
  }

  changeCurrentState(
    state: States,
    helperText: string,
    helperShowInput: boolean = false,
  ) {
    this.currentState = state;
    this.storeApi.addHelper(helperText, helperShowInput);
  }
}
