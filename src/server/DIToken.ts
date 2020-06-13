import { Module } from './modules/Module';
import { MailTransporter } from './modules/mail/Mailer';
import { LogDriver } from './modules/logger/Logger';

export const fakeToken = (module: string) => `${module}Fake`;
export const configToken = (name: string) => `${name}Config`;
export const factoryToken = (name: string) => `${name}Factory`;

export const DIToken = Object.freeze({
  Config: 'config',
  Encrypter: Module.Encryption,
  FakeEncrypter: fakeToken(Module.Encryption),
  EventDispatcher: Module.Events,
  FakeDispatcher: fakeToken(Module.Events),
  Logger: Module.Logger,
  FakeLogger: fakeToken(Module.Logger),
  LogDriverFactory: factoryToken('logDriver'),
  Mailer: Module.Mail,
  MailgunConfig: configToken(MailTransporter.Mailgun),
  SendGridConfig: configToken(MailTransporter.SendGird),
  MailTransporterFactory: factoryToken('mailTransporter'),
  FakeMailer: fakeToken(Module.Mail),
  MailSenderFactory: factoryToken('mailSender'),
  HttpClient: 'httpClient',
  SmtpClientProvider: 'smtpClientProvider',
  FakeSmtpClient: fakeToken('smtpClient'),
});
