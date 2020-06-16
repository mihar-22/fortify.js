import { Mail, MailTransporter } from './Mail';

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
