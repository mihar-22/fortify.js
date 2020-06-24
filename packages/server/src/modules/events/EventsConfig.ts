import { EventMatcher } from './Event';
import { MailEventDispatcher } from '../mail/MailEvent';
import { HttpEventDispatcher } from '../http/HttpEvent';
import { EncryptionEventDispatcher } from '../encryption/EncryptionEvent';
import { DatabaseEventDispatcher } from '../database/DatabaseEvent';

export type LogEventsOption = boolean | EventMatcher | EventMatcher[];

export type GlobalEventDispatcher =
  MailEventDispatcher<any, any> &
  HttpEventDispatcher &
  EncryptionEventDispatcher &
  DatabaseEventDispatcher;

export type GlobalEventsListener = Pick<GlobalEventDispatcher, 'listen' | 'listenTo' | 'listenToAll'>;

export interface EventsConfig {
  logEvents?: LogEventsOption
  tap?: (events: GlobalEventsListener) => void
}
