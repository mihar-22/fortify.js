import { SmtpConfig } from './SmtpClient';

export enum MailTransporter {
  Smtp = 'smtp',
  SendGird = 'sendGrid',
  Mailgun = 'mailgun'
}

export interface Mail<T extends object | undefined> {
  to: string,
  subject: string,
  text?: string
  template?: string
  remoteTemplate?: boolean
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
  send(mail: Mail<any>): Promise<any>
}

export interface MailerConstructor {
  new(...args: any[]): Mailer
}
