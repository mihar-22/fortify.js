import { EventMatcher } from './Event';
import { MailEventDispatcher } from '../mail/MailEvent';

export type LogEventsOption = boolean | EventMatcher | EventMatcher[];

// @TODO: connect all module event types here.
export type GlobalEventDispatcher = MailEventDispatcher<any, any>;
export type GlobalEventsListener = Pick<GlobalEventDispatcher, 'listen' | 'listenTo' | 'listenToAll'>;

export interface EventsConfig {
  logEvents?: LogEventsOption
  tap?: (events: GlobalEventsListener) => void
}
