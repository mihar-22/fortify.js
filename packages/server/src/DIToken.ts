import { Module } from './modules/Module';

export const fakeToken = (module: string) => `${module}Fake`;
export const factoryToken = (name: string) => `${name}Factory`;
export const clientToken = (name: string) => `${name}Client`;

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
  MailTransporterFactory: factoryToken('mailTransporter'),
  FakeMailer: fakeToken(Module.Mail),
  CookieJar: 'cookieJar',
  FakeCookieJar: fakeToken('cookieJar'),
  HttpClient: clientToken('http'),
  HttpRequest: 'httpRequest',
  HttpResponse: 'httpResponse',
  HttpRequestHandler: (name: string) => `${name}RequestHandler`,
  FakeHttpClient: fakeToken(clientToken('http')),
  SmtpClientFactory: factoryToken(clientToken('smtp')),
  FakeSmtpClient: fakeToken(clientToken('smtp')),
  Database: Module.Database,
  Migrator: 'migrator',
  FakeDatabase: fakeToken(Module.Database),
  DatabaseDriverFactory: factoryToken('databaseDriver'),
});
