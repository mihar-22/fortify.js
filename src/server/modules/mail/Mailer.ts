import { SmtpConfig } from './SmtpClient';
import { MailTemplate } from './MailTemplate';

export enum MailTransporter {
  Smtp = 'smtp',
  SendGird = 'sendGrid',
  Mailgun = 'mailgun'
}

export type MailTemplates = { [T in MailTemplate]?: string };

export interface Mail<T> {
  from?: string,
  to: string,
  subject: string,
  text?: string
  template?: string
  data?: T
}

export interface MailConfig {
  transporter?: MailTransporter
  smtp?: SmtpConfig
  templates?: MailTemplates
}

export interface Mailer {
  send<T>(mail: Mail<T>): Promise<void>
}

export interface MailerConstructor {
  new(...args: any[]): Mailer
}
