import Mail from 'nodemailer/lib/mailer';
import { SentMessageInfo } from 'nodemailer';
import { MailResponse } from '../../Mail';

export const Nodemailer = Mail;

export interface SmtpEnvelope {
  from: string,
  to: string[]
}

export interface SmtpResponse extends MailResponse {
  messageId?: string
  accepted?: string[]
  rejected?: string[]
  envelope?: SmtpEnvelope
  envelopeTime?: number
  messageTime?: number
  messageSize?: number
  message?: string
  errors?: string[]
}

export interface SmtpClient {
  sendMail(mailOptions: Mail.Options): Promise<SmtpResponse>;
}

export interface SmtpConfig {
  host: string
  port: number
  username: string
  password: string
}

export type SmtpClientFactory = (config: SmtpConfig) => SmtpClient;

export interface SmtpTestAccount {
  username: string
  password: string
}

export const getPreviewUrl = (response: SmtpResponse) => require('nodemailer').getTestMessageUrl(
  response as SentMessageInfo,
);

export const createSmtpTestAccount = async (): Promise<SmtpTestAccount> => {
  const { user, pass } = await require('nodemailer').createTestAccount();
  return { username: user, password: pass };
};

export const createSmtpTransport = (config: SmtpConfig): SmtpClient => require('nodemailer')
  .createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: {
      user: config.username,
      pass: config.password,
    },
  });
