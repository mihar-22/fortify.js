import ServiceProvider from '../support/ServiceProvider';
import MailServiceProvider from './mailer/MailServiceProvider';
import RouteServiceProvider from './routing/RouteServiceProvider';
import AuthServiceProvider from './auth/AuthServiceProvider';
import DatabaseServiceProvider from './database/DatabaseServiceProvider';
import EventsServiceProvider from './events/EventsServiceProvider';
import SessionServiceProvider from './session/SessionServiceProvider';

export enum Service {
  Auth = 'auth',
  Database = 'database',
  Events = 'events',
  Mailer = 'mailer',
  Routing = 'routing',
  Session = 'session',
}

export type ServiceProviders = Record<Service, undefined | ServiceProvider>;

export const defaultServiceProviders: ServiceProviders = {
  [Service.Auth]: new AuthServiceProvider(),
  [Service.Database]: new DatabaseServiceProvider(),
  [Service.Events]: new EventsServiceProvider(),
  [Service.Session]: new SessionServiceProvider(),
  [Service.Mailer]: new MailServiceProvider(),
  [Service.Routing]: new RouteServiceProvider(),
};
