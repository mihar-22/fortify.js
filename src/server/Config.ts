import { AsyncContainerModule } from 'inversify';
import { MailConfig } from './modules/mail/Mailer';
import { SessionConfig } from './modules/session/Session';
import { EncryptionConfig } from './modules/encryption/Encrypter';
import Module from './modules/Module';

export enum Env {
  Development = 'development',
  Production = 'production'
}

export default interface Config {
  [id: string]: string | Record<string, any> | undefined
  env: Env,
  modules?: AsyncContainerModule[],
  [Module.Mail]?: MailConfig,
  [Module.Session]?: SessionConfig,
  [Module.Encryption]?: EncryptionConfig,
}
