import { MailConfig } from './modules/mail/MailConfig';
import { SessionConfig } from './modules/session/Session';
import { Module } from './modules/Module';
import { LoggerConfig } from './modules/logger/LoggerConfig';
import { EncryptionConfig } from './modules/encryption/EncryptionConfig';
import { EventsConfig } from './modules/events/EventsConfig';
import { DatabaseConfig } from './modules/database/DatabaseConfig';
import { HttpConfig } from './modules/http/HttpConfig';

export enum Env {
  Testing = 'testing',
  Development = 'development',
  Production = 'production'
}

export interface Config {
  [id: string]: any
  env?: Env
  skipBootChecks?: boolean
  [Module.Logger]?: LoggerConfig
  [Module.Mail]?: MailConfig
  [Module.Http]?: HttpConfig
  [Module.Session]?: SessionConfig
  [Module.Encryption]?: EncryptionConfig
  [Module.Events]?: EventsConfig
  [Module.Database]?: DatabaseConfig
}
