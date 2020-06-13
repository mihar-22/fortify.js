import { Module } from './modules/Module';
import { MailTransporter } from './modules/mail/Mailer';

export const fakeToken = (module: string) => `${module}Fake`;
export const configToken = (name: string) => `${name}Config`;

export const DIToken = Object.freeze({
  Config: 'config',
  Encrypter: Module.Encryption,
  FakeEncrypter: fakeToken(Module.Encryption),
  EventDispatcher: Module.Events,
  FakeDispatcher: fakeToken(Module.Events),
  Logger: Module.Logger,
  FakeLogger: fakeToken(Module.Logger),
  Mailer: Module.Mail,
  MailgunConfig: configToken(MailTransporter.Mailgun),
  SendGridConfig: configToken(MailTransporter.SendGird),
  MailTransporterFactory: 'mailTransporterFactory',
  FakeMailer: fakeToken(Module.Mail),
  MailSenderFactory: 'mailSenderFactory',
  HttpClient: 'httpClient',
  SmtpClientProvider: 'smtpClientProvider',
  FakeSmtpClient: fakeToken('smtpClient'),
});
