import Mail from 'nodemailer/lib/mailer';
import nodemailer from 'nodemailer';
import { SentMessageInfo } from 'nodemailer/lib/smtp-transport';
import { SmtpConfig } from '../../MailConfig';

export const Nodemailer = Mail;

export type SmtpResponse = SentMessageInfo;

export interface SmtpClient {
  sendMail(mailOptions: Mail.Options): Promise<SmtpResponse>;
}

export type SmtpClientFactory = (config: SmtpConfig) => SmtpClient;

export interface SmtpTestAccount {
  username: string
  password: string
}

export const getPreviewUrl = (response: SmtpResponse) => nodemailer.getTestMessageUrl(response);

export const createSmtpTestAccount = async (): Promise<SmtpTestAccount> => {
  const { user, pass } = await nodemailer.createTestAccount();
  return { username: user, password: pass };
};

export const createSmtpTransport = (config: SmtpConfig): SmtpClient => nodemailer.createTransport({
  host: config.host,
  port: config.port,
  secure: config.port === 465,
  auth: {
    user: config.username,
    pass: config.password,
  },
});
