import { SmtpConfig } from './transport/Smtp';

export enum MailTransport {
  Smtp,
  SendGird,
  MailGun
}

export interface MailTemplates {
  verifyEmail?: string,
  passwordReset?: string,
}

export interface MailerConfig {
  transport?: MailTransport
  smtp?: SmtpConfig
  templates?: MailTemplates
}

export interface Mailer {
}
