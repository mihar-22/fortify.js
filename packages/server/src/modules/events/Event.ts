import { LogLevel } from '../logger/Logger';
import { isRegExp, isString } from '../../utils';

export type EventCode = string;

export type EventMatcher = EventCode | RegExp;

export const isEventMatcher = (input: any) => isString(input) || isRegExp(input);

export class Event<EventCodeValue, PayloadType> {
  public code: EventCodeValue;

  public firedAt?: Date;

  public queuedAt?: Date;

  public payload: PayloadType;

  public description: string;

  public logLevel: LogLevel;

  constructor(
    code: EventCodeValue,
    description: string,
    payload: PayloadType,
    logLevel?: LogLevel,
  ) {
    this.code = code;
    this.payload = payload;
    this.description = description;
    this.logLevel = logLevel ?? LogLevel.Info;
  }
}

export type EventCallback<EventCodeValue, PayloadType> = (
  event: Event<EventCodeValue, PayloadType>
) => void;
