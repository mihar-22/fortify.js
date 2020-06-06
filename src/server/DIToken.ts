import { MailDriver } from './modules/mail/Mailer';
import Module from './modules/Module';

const DIToken = Object.freeze({
  Env: 'env',
  Config: 'config',
  Encrypter: Module.Encryption,
  EventDispatcher: Module.Events,
  Mailer: Module.Mail,
  SmtpMailer: MailDriver.Smtp,
  SendGridMailer: MailDriver.SendGird,
  MailGunMailer: MailDriver.MailGun,
  MailSender: 'mailSender',
  HttpClient: 'httpClient',
  SmtpClientProvider: 'smtpClientProvider',
});

export default DIToken;
