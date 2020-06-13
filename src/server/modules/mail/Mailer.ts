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
  data?: T
}

export type MailSenderFactory = () => string;

export interface Mailer {
  send(mail: Mail<any>): Promise<any>
}

export interface MailerConstructor {
  new(...args: any[]): Mailer
}

export type MailTransporterFactory = (transporter: MailTransporter) => Mailer;
