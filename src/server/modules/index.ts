import { AsyncContainerModule } from 'inversify';
import { MailModule } from './mail/MailModule';
import { AuthModule } from './auth/AuthModule';
import { DatabaseModule } from './database/DatabaseModule';
import { EventsModule } from './events/EventsModule';
import { SessionModule } from './session/SessionModule';
import { EncryptionModule } from './encryption/EncryptionModule';
import { LoggerModule } from './logger/LoggerModule';

export const coreModules: AsyncContainerModule[] = [
  LoggerModule,
  EncryptionModule,
  EventsModule,
  MailModule,
  DatabaseModule,
  SessionModule,
  AuthModule,
];
