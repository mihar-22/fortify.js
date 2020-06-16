import { EventMatcher } from './Event';
import { Listener } from './Dispatcher';

export type LogEventsOption = boolean | EventMatcher | EventMatcher[];

export interface EventsConfig {
  logEvents?: LogEventsOption
  // @TODO: connect all event types here.
  tap?: (events: Listener<any>) => void
}
