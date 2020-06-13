import { MailConfig } from './modules/mail/MailConfig';
import { SessionConfig } from './modules/session/Session';
import { Module } from './modules/Module';
import { LoggerConfig } from './modules/logger/LoggerConfig';
import { EncryptionConfig } from './modules/encryption/EncryptionConfig';

export enum Env {
  Testing = 'testing',
  Development = 'development',
  Production = 'production'
}

export interface Config {
  [id: string]: string | Record<string, any> | undefined
  env?: Env,
  [Module.Logger]?: LoggerConfig,
  [Module.Mail]?: MailConfig,
  [Module.Session]?: SessionConfig,
  [Module.Encryption]?: EncryptionConfig,
}
