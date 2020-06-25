import { LogLevel } from '../logger/Logger';
import { isRegExp, isString } from '../../utils';

export type EventCode = string;

export type EventMatcher = EventCode | RegExp;

export const isEventMatcher = (input: any) => isString(input) || isRegExp(input);

export class Event<EventCodeValue, PayloadType> {
  public firedAt?: Date;

  public queuedAt?: Date;

  constructor(
    public code: EventCodeValue,
    public description: string,
    public payload: PayloadType,
    public logLevel: LogLevel = LogLevel.Info,
  ) {}
}

export type EventCallback<EventCodeValue, PayloadType> = (
  event: Event<EventCodeValue, PayloadType>
) => void;
