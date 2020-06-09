import { SmtpConfig } from './SmtpClient';

export enum MailTransporter {
  Smtp = 'smtp',
  SendGird = 'sendGrid',
  Mailgun = 'mailgun'
}

export interface Mail<T extends object> {
  to: string,
  subject: string,
  text?: string
  template?: string
  data?: T
}

export type MailSenderFactory = () => string;

export interface MailFrom {
  name: string
  address: string
}

export interface MailConfig {
  from?: MailFrom,
  transporter?: MailTransporter
  smtp?: SmtpConfig
}

export interface Mailer {
  send<T extends object>(mail: Mail<T>): Promise<void>
}

export interface MailerConstructor {
  new(...args: any[]): Mailer
}
