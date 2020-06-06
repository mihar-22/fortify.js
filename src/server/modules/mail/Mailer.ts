export enum MailDriver {
  Smtp = 'smtp',
  SendGird = 'sendgrid',
  MailGun = 'mailgun'
}

export interface MailTemplates {
  verifyEmail?: string,
  passwordReset?: string,
}

export interface SmtpConfig {
  host: string
  port: number
  username: string
  password: string
  fromName: string
  fromAddress: string
}

export interface Mail<T> {
  from?: string,
  to: string,
  subject: string,
  text?: string
  template?: string
  data?: T
}

export interface MailConfig {
  driver: MailDriver
  smtp?: SmtpConfig
  templates?: MailTemplates
}

export interface Mailer {
  send<T>(mail: Mail<T>): Promise<void>
}
