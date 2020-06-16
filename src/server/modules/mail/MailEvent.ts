import { Dispatcher } from '../events/Dispatcher';
import { Mail, MailResponse } from './Mail';

export enum MailEvent {
  Sending = 'MAIL_SENDING',
  Sent = 'MAIL_SENT',
  PreviewCreated = 'MAIL_PREVIEW_CREATED',
  Failed = 'MAIL_SENDING_FAILED'
}

export interface MailEventPayload<MailDataType, MailResponseType extends MailResponse> {
  [MailEvent.Sending]: { mail: Mail<MailDataType> }
  [MailEvent.Sent]: { mail: Mail<MailDataType>, response: MailResponseType }
  [MailEvent.PreviewCreated]: { previewUrl: string, mail: Mail<MailDataType> }
  [MailEvent.Failed]: { mail: Mail<MailDataType>, response: MailResponseType }
}

export type MailEventDispatcher<
  MailDataType,
  MailResponseType extends MailResponse
> = Dispatcher<MailEventPayload<MailDataType, MailResponseType>>;
