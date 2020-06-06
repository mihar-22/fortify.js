import { MailTransporter } from './modules/mail/Mailer';
import Module from './modules/Module';

const DIToken = Object.freeze({
  Env: 'env',
  Config: 'config',
  Encrypter: Module.Encryption,
  EventDispatcher: Module.Events,
  Mailer: Module.Mail,
  SmtpMailer: MailTransporter.Smtp,
  SendGridMailer: MailTransporter.SendGird,
  MailGunMailer: MailTransporter.Mailgun,
  MailSender: 'mailSender',
  HttpClient: 'httpClient',
  SmtpClientProvider: 'smtpClientProvider',
});

export default DIToken;
