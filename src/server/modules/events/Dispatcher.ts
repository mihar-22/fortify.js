import { Event, EventCallback, EventMatcher } from './Event';

export type RemoveListenerCallback = () => void;

export type PayloadType<T> = [T] extends [infer U]
  ? U
  : [T] extends [void] ? [] : [T];

export interface Listener<
  EventPayloadRecordType,
  EventCodeType extends keyof EventPayloadRecordType = keyof EventPayloadRecordType
> {
  listen(
    eventCode: EventCodeType,
    cb: EventCallback<EventCodeType, PayloadType<EventPayloadRecordType[EventCodeType]>>
  ): RemoveListenerCallback

  listenTo(
    matcher: EventMatcher,
    cb: EventCallback<EventCodeType, EventPayloadRecordType[EventCodeType]>
  ): RemoveListenerCallback

  listenToAll(
    cb: EventCallback<EventCodeType, EventPayloadRecordType[EventCodeType]>
  ): RemoveListenerCallback
}

export interface Dispatcher<
  EventPayloadRecordType = any,
  EventCodeType extends keyof EventPayloadRecordType = keyof EventPayloadRecordType
> extends Listener<EventPayloadRecordType> {
  dispatch(event: Event<EventCodeType, PayloadType<EventPayloadRecordType[EventCodeType]>>): void
  push(event: Event<EventCodeType, PayloadType<EventPayloadRecordType[EventCodeType]>>): void
  flush(eventCode: EventCodeType): void
  forgetPushed(): void
}
