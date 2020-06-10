import { EventCode, EventPayloadRecord } from '../events/Event';

export class Log<ContextType> {
  public message: string;

  public eventCode?: EventCode;

  // eslint-disable-next-line react/static-property-placement
  public context?: ContextType;

  constructor(message: string, eventCode?: EventCode, context?: ContextType) {
    this.message = message;
    this.context = context;
    this.eventCode = eventCode;
  }
}

export type LogBuilder<ContextType> = (context?: ContextType,) => Log<ContextType>;

export type LogBuilderRecord<
  EventCodeEnum extends keyof any,
  EventDataRecordType extends EventPayloadRecord<EventCodeEnum>,
> = {
  [P in keyof EventDataRecordType]: LogBuilder<EventDataRecordType[P]>
};
