import { Module } from './modules/Module';

export const fakeToken = (module: string) => `${module}Fake`;
export const configToken = (name: string) => `${name}Config`;
export const factoryToken = (name: string) => `${name}Factory`;

export const DIToken = Object.freeze({
  Config: 'config',
  Encrypter: Module.Encryption,
  FakeEncrypter: fakeToken(Module.Encryption),
  EventDispatcher: Module.Events,
  FakeDispatcher: fakeToken(Module.Events),
  Cookies: Module.Cookies,
  Logger: Module.Logger,
  FakeLogger: fakeToken(Module.Logger),
  LogDriverFactory: factoryToken('logDriver'),
  Mailer: Module.Mail,
  MailTransporterFactory: factoryToken('mailTransporter'),
  FakeMailer: fakeToken(Module.Mail),
  HttpClient: 'httpClient',
  FakeHttpClient: fakeToken('httpClient'),
  SmtpClientFactory: factoryToken('smtpClient'),
  FakeSmtpClient: fakeToken('smtpClient'),
});
