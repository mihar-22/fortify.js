import { MailerConfig } from './services/mailer/Mailer';
import ServerlessProvider from './ServerlessProvider';
import { SessionConfig } from './services/session/Session';
import { EncryptionConfig } from './services/encryption/Encrypter';
import { Service, ServiceProviders } from './services/Service';

export enum Env {
  Development = 'development',
  Testing = 'testing',
  Production = 'production'
}

export default interface Config {
  [id: string]: string | Record<string, any> | undefined
  [Service.Mailer]?: MailerConfig,
  [Service.Session]?: SessionConfig,
  [Service.Encryption]: EncryptionConfig,
  env: Env,
  serviceProviders?: ServiceProviders,
  serverlessProvider: ServerlessProvider
}
