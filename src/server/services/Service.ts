import { ServiceProviderConstructor } from '../support/ServiceProvider';

export enum Service {
  Auth = 'auth',
  Database = 'database',
  Encryption = 'encryption',
  Events = 'events',
  Mailer = 'mailer',
  Routing = 'routing',
  Session = 'session',
}

export type ServiceProviders = Record<Service, undefined | ServiceProviderConstructor>;
