import { Service, ServiceProviders } from './services';
import { MailerConfig } from './services/mailer/Mailer';
import ServerlessProvider from './ServerlessProvider';
import { SessionConfig } from './services/session/Session';
import { EncryptionConfig } from './services/encryption/Encrypter';

export default interface Config {
  [id: string]: string | Record<string, any> | undefined
  [Service.Mailer]?: MailerConfig,
  [Service.Session]?: SessionConfig,
  [Service.Encryption]?: EncryptionConfig,
  serviceProviders?: ServiceProviders,
  serverlessProvider: ServerlessProvider
}
