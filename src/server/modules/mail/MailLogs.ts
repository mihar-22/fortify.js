import { Logs } from '../../support/Log';
import { MailEvent } from './MailEvents';
import { Module } from '../Module';
import { Mail } from './Mailer';

export const MailLogs: Logs<MailEvent, Module> = {
  [MailEvent.MailSending]: <T extends object>(mail: Mail<T>) => ({
    module: Module.Mail,
    event: MailEvent.MailSending,
    message: `Sending mail to ${mail.to}.`,
    context: { mail },
  }),
  [MailEvent.MailSent]: (subject: string, to: string, response?: any) => ({
    module: Module.Mail,
    event: MailEvent.MailSent,
    message: `Mail with subject [${subject}] has been sent to [${to}].`,
    context: { response: response ?? {} },
  }),
};
