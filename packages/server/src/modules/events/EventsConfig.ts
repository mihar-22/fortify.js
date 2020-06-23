import { EventMatcher } from './Event';
import { MailEventDispatcher } from '../mail/MailEvent';
import { HttpEventDispatcher } from '../http/HttpEvent';
import { EncryptionEventDispatcher } from '../encryption/EncryptionEvent';

export type LogEventsOption = boolean | EventMatcher | EventMatcher[];

// @TODO: connect all module event types here.
export type GlobalEventDispatcher =
  MailEventDispatcher<any, any> &
  HttpEventDispatcher &
  EncryptionEventDispatcher;

export type GlobalEventsListener = Pick<GlobalEventDispatcher, 'listen' | 'listenTo' | 'listenToAll'>;

export interface EventsConfig {
  logEvents?: LogEventsOption
  tap?: (events: GlobalEventsListener) => void
}
