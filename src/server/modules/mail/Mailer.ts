import { PayloadType } from '../events/Dispatcher';

export enum MailTransporter {
  Smtp = 'smtp',
  SendGird = 'sendGrid',
  Mailgun = 'mailgun'
}

export interface Mail<T> {
  to: string,
  subject: string,
  text?: string
  template?: string
  data: PayloadType<T>
}

export interface Mailer<ConfigType> {
  send(mail: Mail<any>): Promise<any>
  useSandbox(sandbox: boolean): void
  setConfig(config: ConfigType): void
  setSender(sender: string): void
}

export interface MailerConstructor {
  new(...args: any[]): Mailer<any>
}

export type MailTransporterFactory = (transporter: MailTransporter) => Mailer<any>;
