import { MailgunConfig, SendGridConfig, SmtpConfig } from './transporters';
import { MailTransporter } from './Mail';

export interface MailFrom {
  name: string
  address: string
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
