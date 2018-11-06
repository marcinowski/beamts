import { EventHandlerInterface } from './types';
import { RootState } from '@/store/types';
import { Store } from 'vuex';
import {
  Coordinates,
  Rotation,
  EventTypes,
  CustomEvent,
  LineCoordinates,
} from '@/types/types';
import {
  getAngle,
  getVector,
  getVectorLength,
  get2DCrossProduct,
} from '@/helpers/helpers';
import { StoreApi } from '@/event-handlers/store-api';

enum States {
  BASE,
  END,
  ARC,
}

export class RotateEventHandler implements EventHandlerInterface {
  private storeApi: StoreApi;
  private currentState: States;
  private baseCoordinates?: Coordinates;
  private endCoordinates?: Coordinates;

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
      event.type === EventTypes.CLICK ||
      event.type === EventTypes.SELECTED_OBJECT
    ) {
      this.baseCoordinates = svgCoordinates;
      this.storeApi.setHelperLineStart(svgCoordinates);
      this.initEndState();
    } else if (event.type === EventTypes.KEY_ESC) {
      return this.initBaseState();
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
      this.endCoordinates = svgCoordinates;
      this.storeApi.setHelperLineEnd(svgCoordinates);
      this.initArcState();
    } else if (event.type === EventTypes.MOUSEMOVE) {
      this.storeApi.setHelperLineEnd(svgCoordinates);
    } else if (event.type === EventTypes.KEY_ESC) {
      return this.initBaseState();
    }
  }

  handleArcEvent(event: CustomEvent, svgCoordinates: Coordinates) {
    if (
      this.currentState !== States.ARC ||
      !this.baseCoordinates ||
      !this.endCoordinates
    ) {
      return;
    }
    if (
      event.type === EventTypes.CLICK ||
      event.type === EventTypes.SELECTED_OBJECT ||
      event.type === EventTypes.MOUSEMOVE
    ) {
      const baseAngleVector = getVector(
        this.baseCoordinates,
        this.endCoordinates,
      );
      const radVector = getVector(this.baseCoordinates, svgCoordinates);
      const angle = getAngle(baseAngleVector, radVector);
      if (
        event.type === EventTypes.CLICK ||
        event.type === EventTypes.SELECTED_OBJECT
      ) {
        const sign = Math.sign(get2DCrossProduct(baseAngleVector, radVector));
        const rotation: Rotation = {
          angle: sign * angle,
          origin: this.baseCoordinates,
        };
        this.storeApi.rotateSelected(rotation);
        this.initBaseState();
      } else if (event.type === EventTypes.MOUSEMOVE) {
        const arcBase: LineCoordinates = {
          start: this.endCoordinates,
          end: svgCoordinates,
        };
        this.storeApi.setHelperArcBase(arcBase);
        const baseVector = getVector(this.endCoordinates, this.baseCoordinates);
        const radius = getVectorLength(baseVector);
        const arcVector = getVector(this.baseCoordinates, svgCoordinates);
        const sweep = get2DCrossProduct(baseVector, arcVector) < 0 ? 1 : 0;
        const largeArc = Math.abs(angle) > Math.PI ? 1 : 0;
        this.storeApi.setHelperArcEnd(radius, 0, sweep, largeArc);
      }
    } else if (event.type === EventTypes.KEY_ESC) {
      return this.initBaseState();
    }
  }

  initBaseState() {
    this.currentState = States.BASE;
    this.baseCoordinates = undefined;
    this.endCoordinates = undefined;
    this.storeApi.clearHelperArc();
    this.storeApi.clearHelperLine();
    this.storeApi.addHelper('Click to set an origin of rotation', false);
  }

  initEndState() {
    this.currentState = States.END;
    this.storeApi.addHelper('Click to set a radius of rotation', false);
  }

  initArcState() {
    this.currentState = States.ARC;
    this.storeApi.addHelper('Click to set an angle of rotation', false);
  }
}
