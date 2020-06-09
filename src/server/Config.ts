import { AsyncContainerModule } from 'inversify';
import { MailConfig } from './modules/mail/Mailer';
import { SessionConfig } from './modules/session/Session';
import { EncryptionConfig } from './modules/encryption/Encrypter';
import { Module } from './modules/Module';
import { LoggerConfig } from './modules/logger/Logger';

export enum Env {
  Testing = 'testing',
  Development = 'development',
  Production = 'production'
}

export interface Config {
  [id: string]: string | Record<string, any> | undefined
  env?: Env,
  modules?: AsyncContainerModule[],
  [Module.Logger]?: LoggerConfig,
  [Module.Mail]?: MailConfig,
  [Module.Session]?: SessionConfig,
  [Module.Encryption]?: EncryptionConfig,
}
