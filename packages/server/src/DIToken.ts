import { Module } from './modules/Module';

export const fakeToken = (module: string) => `${module}Fake`;
export const factoryToken = (name: string) => `${name}Factory`;
export const clientToken = (name: string) => `${name}Client`;
export const adapterToken = (name: string) => `${name}Adapter`;
export const constructorToken = (name: string) => `${name}Constructor`;

export const DIToken = Object.freeze({
  Config: 'config',
  App: 'app',
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
  HttpClient: clientToken('http'),
  HttpRouter: 'httpRouter',
  HttpAdapterFactory: factoryToken(adapterToken('http')),
  HttpAdapterConstructor: constructorToken(adapterToken('http')),
  HttpRouteHandlerFactory: factoryToken('httpRouteHandler'),
  FakeHttpClient: fakeToken(clientToken('http')),
  SmtpClientFactory: factoryToken(clientToken('smtp')),
  FakeSmtpClient: fakeToken(clientToken('smtp')),
});
