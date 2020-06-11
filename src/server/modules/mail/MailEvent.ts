import { Mail } from './Mailer';
import {
  Event, EventBuilderRecord, EventCallbackRecord, EventPayloadRecord,
} from '../events/Event';
import { LogLevel } from '../logger/Logger';

export enum MailEventCode {
  MailSending = 'MAIL_SENDING',
  MailSent = 'MAIL_SENT',
  MailPreviewCreated = 'MAIL_PREVIEW_CREATED',
}

export interface MailEventData<
  MailDataType extends object | undefined,
  MailerResponseType extends object | undefined
> extends EventPayloadRecord<MailEventCode> {
  [MailEventCode.MailSending]: { mail: Mail<MailDataType> }
  [MailEventCode.MailSent]: { mail: Mail<MailDataType>, response: MailerResponseType }
  [MailEventCode.MailPreviewCreated]: { previewUrl: string, mail: Mail<MailDataType> }
}

export const MailEvent: EventBuilderRecord<MailEventCode, MailEventData<any, any>> = {
  [MailEventCode.MailSending]: (payload) => new Event(
    MailEventCode.MailSending,
    `Mail [${payload!.mail.subject}] -> SENDING -> [${payload!.mail.to}]`,
    payload,
  ),

  [MailEventCode.MailSent]: (payload) => new Event(
    MailEventCode.MailSent,
    `Mail [${payload!.mail.subject}] -> SENT -> [${payload!.mail.to}]`,
    payload,
  ),

  [MailEventCode.MailPreviewCreated]: (payload) => new Event(
    MailEventCode.MailPreviewCreated,
    `Generated mail [${payload!.mail.subject}] preview: ${payload!.previewUrl}`,
    payload,
    LogLevel.Info,
  ),
};

export type MailEventCallback<
  MailDataType extends object | undefined,
  MailerResponseType extends object | undefined
> = EventCallbackRecord<MailEventCode, MailEventData<MailDataType, MailerResponseType>>;
