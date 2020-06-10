import { MailEventCode, MailEventData } from './MailEvent';
import { Log, LogBuilderRecord } from '../logger/Log';

export const MailLog: LogBuilderRecord<MailEventCode, MailEventData<any, any>> = {
  [MailEventCode.MailSending]: (context) => new Log(
    `Sending mail to ${context!.mail.to}.`,
    MailEventCode.MailSending,
    context,
  ),

  [MailEventCode.MailSent]: (context) => new Log(
    `Mail with subject [${context!.mail.subject}] has been sent to [${context!.mail.to}].`,
    MailEventCode.MailSent,
    context,
  ),

  [MailEventCode.MailPreviewCreated]: (context) => new Log(
    `Preview URL: ${context!.previewUrl}`,
    MailEventCode.MailPreviewCreated,
    context,
  ),
};
