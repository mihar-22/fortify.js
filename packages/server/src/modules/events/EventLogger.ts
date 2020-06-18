import { Dispatcher } from './Dispatcher';
import { Event, EventMatcher, isEventMatcher } from './Event';
import { Logger } from '../logger/Logger';
import { LogEventsOption } from './EventsConfig';
import { isArray } from '../../utils';

export class EventLogger {
  public static log(
    logger: Logger,
    dispatcher: Dispatcher,
    events?: LogEventsOption,
  ) {
    if (!events) { return; }

    const callback = (event: Event<any, any>) => {
      logger[event.logLevel]({
        label: event.code,
        message: event.description,
        data: event.payload,
      });
    };

    if (isEventMatcher(events)) {
      dispatcher.listenTo(events as EventMatcher, callback);
    } else if (isArray(events)) {
      (events as EventMatcher[])
        .filter(isEventMatcher)
        .forEach((event) => { dispatcher.listenTo(event, callback); });
    } else {
      dispatcher.listenToAll(callback);
    }
  }
}
