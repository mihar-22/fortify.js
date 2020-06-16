import { Mail } from './Mailer';
import { Dispatcher } from '../events/Dispatcher';

export enum MailEvent {
  MailSending = 'MAIL_SENDING',
  MailSent = 'MAIL_SENT',
  MailPreviewCreated = 'MAIL_PREVIEW_CREATED',
}

export interface MailEventPayload<MailDataType, MailResponseType> {
  [MailEvent.MailSending]: { mail: Mail<MailDataType> }
  [MailEvent.MailSent]: { mail: Mail<MailDataType>, response: MailResponseType }
  [MailEvent.MailPreviewCreated]: { previewUrl: string, mail: Mail<MailDataType> }
}

export type MailEventDispatcher<
  MailDataType,
  MailResponseType
> = Dispatcher<MailEventPayload<MailDataType, MailResponseType>>;
