import Mail from 'nodemailer/lib/mailer';
import nodemailer from 'nodemailer';
import { SmtpConfig } from './Mailer';

export type SmtpClient = Mail;
export type SmtpProvider = Promise<SmtpClient>;

export interface SmtpTestAccount {
  username: string
  senderName: string
  senderAddress: string,
  password: string
}

export const createSmtpTestAccount = async (): Promise<SmtpTestAccount> => {
  const { user, pass } = await nodemailer.createTestAccount();

  return {
    username: user,
    password: pass,
    senderName: user.substr(0, user.indexOf('@')),
    senderAddress: user,
  };
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
