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

export enum MailConfigErrorCode {
  MissingTransporterConfig = 'MISSING_TRANSPORTER_CONFIG',
  MissingMailFrom = 'MISSING_MAIL_FROM'
}

export const MailConfigError = {
  [MailConfigErrorCode.MissingTransporterConfig]: (transporter: MailTransporter) => ({
    code: MailConfigErrorCode.MissingTransporterConfig,
    message: `The mail transporter [${transporter}] was selected but no configuration was found.`,
    path: transporter,
  }),

  [MailConfigErrorCode.MissingMailFrom]: {
    code: MailConfigErrorCode.MissingMailFrom,
    message: 'Mail cannot be sent without the from field being set.',
    path: 'from',
  },
};
