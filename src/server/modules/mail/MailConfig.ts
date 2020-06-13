import { MailTransporter } from './Mailer';

export interface MailFrom {
  name: string
  address: string
}

export interface MailgunConfig {
  domain: string
  apiKey: string
  endpoint?: string
}

export interface SendGridConfig {
}

export interface SmtpConfig {
  host: string
  port: number
  username: string
  password: string
}

export interface MailConfig {
  from?: MailFrom
  transporter?: MailTransporter
  [MailTransporter.Smtp]?: SmtpConfig
  [MailTransporter.Mailgun]?: MailgunConfig
  [MailTransporter.SendGird]?: SendGridConfig
}

export enum MailConfigError {
  MissingTransporterConfig = 'MISSING_TRANSPORTER_CONFIG',
  MissingMailFrom = 'MISSING_MAIL_FROM'
}
