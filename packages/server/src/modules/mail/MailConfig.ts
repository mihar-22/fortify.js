import {
  MailgunConfig, SendGridConfig, SmtpConfig, MailTransporterId,
} from './transporters';

export interface MailFrom {
  name: string
  address: string
}

export interface MailConfig {
  from?: MailFrom
  transporter?: MailTransporterId
  sandbox?: boolean
  allowSandboxInProduction?: boolean
  [MailTransporterId.Smtp]?: SmtpConfig
  [MailTransporterId.Mailgun]?: MailgunConfig
  [MailTransporterId.SendGird]?: SendGridConfig
}
