import { Event, EventCallback, EventMatcher } from './Event';

export type RemoveListenerCallback = () => void;

export type PayloadType<T> = [T] extends [infer U]
  ? U
  : [T] extends [void] ? [] : [T];

export interface Listener<EventPayloadRecordType> {
  listen<E extends keyof EventPayloadRecordType>(
    eventCode: E,
    cb: EventCallback<E, PayloadType<EventPayloadRecordType[E]>>
  ): RemoveListenerCallback

  listenTo<E extends keyof EventPayloadRecordType>(
    matcher: EventMatcher,
    cb: EventCallback<E, EventPayloadRecordType[E]>
  ): RemoveListenerCallback

  listenToAll<E extends keyof EventPayloadRecordType>(
    cb: EventCallback<E, EventPayloadRecordType[E]>
  ): RemoveListenerCallback
}

export interface Dispatcher<EventPayloadRecordType = any> extends Listener<EventPayloadRecordType> {
  dispatch<E extends keyof EventPayloadRecordType>(
    event: Event<E, PayloadType<EventPayloadRecordType[E]>>
  ): void

  push<E extends keyof EventPayloadRecordType>(
    event: Event<E, PayloadType<EventPayloadRecordType[E]>>
  ): void

  flush<E extends keyof EventPayloadRecordType>(eventCode: E): void

  forgetPushed(): void
}
