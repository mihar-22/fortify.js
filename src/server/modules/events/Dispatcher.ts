import { Event, EventCallback, EventCode } from './Event';

export type RemoveListenerCallback = () => void;

export interface Dispatcher {
  listen<PayloadType>(eventCode: EventCode, cb: EventCallback<PayloadType>): RemoveListenerCallback
  dispatch<PayloadType>(event: Event<PayloadType>): void
  push<PayloadType>(event: Event<PayloadType>): void
  flush(eventCode: EventCode): void
  forgetPushed(): void
}
