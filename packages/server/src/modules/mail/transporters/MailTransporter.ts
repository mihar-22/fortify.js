import { Mail } from '../Mail';

export enum MailTransporterId {
  Smtp = 'smtp',
  SendGird = 'sendGrid',
  Mailgun = 'mailgun'
}

export interface MailTransporter<ConfigType = any, ResponseType = any> {
  id: MailTransporterId
  config?: ConfigType
  sandbox: boolean
  sender: string;
  send(mail: Mail<any>, html?: string): Promise<ResponseType>;
}

export interface MailerTransporterConstructor {
  new(...args: any[]): MailTransporter
}

export type MailTransporterFactory = (id: MailTransporterId) => MailTransporter;
