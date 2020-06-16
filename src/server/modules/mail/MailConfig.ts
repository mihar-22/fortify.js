import { MailTransporter } from './Mailer';

export interface MailFrom {
  name: string
  address: string
}

export enum MailgunRegion {
  US = 'us',
  EU = 'eu'
}

export interface MailgunConfig {
  domain: string
  apiKey: string
  region?: MailgunRegion
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
  sandbox?: boolean
  allowSandboxInProduction?: boolean
  [MailTransporter.Smtp]?: SmtpConfig
  [MailTransporter.Mailgun]?: MailgunConfig
  [MailTransporter.SendGird]?: SendGridConfig
}
