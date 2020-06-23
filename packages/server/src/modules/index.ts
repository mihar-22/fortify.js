import { ModuleProviderConstructor } from '../support/ModuleProvider';
import { MailModule } from './mail/MailModule';
import { AuthModule } from './auth/AuthModule';
import { SessionModule } from './session/SessionModule';
import { DatabaseModule } from './database/DatabaseModule';
import { HttpModule } from './http/HttpModule';
import { EventsModule } from './events/EventsModule';
import { EncryptionModule } from './encryption/EncryptionModule';
import { LoggerModule } from './logger/LoggerModule';

export const coreModules: ModuleProviderConstructor[] = [
  LoggerModule,
  EncryptionModule,
  EventsModule,
  MailModule,
  HttpModule,
  DatabaseModule,
  SessionModule,
  AuthModule,
];
