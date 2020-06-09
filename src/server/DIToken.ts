import { Module } from './modules/Module';

const fake = (module: string) => `${module}Fake`;

export const DIToken = Object.freeze({
  Env: 'env',
  Config: 'config',
  Encrypter: Module.Encryption,
  FakeEncrypter: fake(Module.Encryption),
  EventDispatcher: Module.Events,
  FakeDispatcher: fake(Module.Events),
  Logger: Module.Logger,
  FakeLogger: fake(Module.Logger),
  Mailer: Module.Mail,
  FakeMailer: fake(Module.Mail),
  MailSenderFactory: 'mailSenderFactory',
  HttpClient: 'httpClient',
  SmtpClientProvider: 'smtpClientProvider',
  FakeSmtpClient: fake('smtpClient'),
});
