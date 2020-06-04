import MailServiceProvider from './mailer/MailServiceProvider';
import RouteServiceProvider from './routing/RouteServiceProvider';
import AuthServiceProvider from './auth/AuthServiceProvider';
import DatabaseServiceProvider from './database/DatabaseServiceProvider';
import EventsServiceProvider from './events/EventsServiceProvider';
import SessionServiceProvider from './session/SessionServiceProvider';
import EncryptionServiceProvider from './encryption/EncryptionServiceProvider';
import { Service, ServiceProviders } from './Service';

const coreServiceProviders: ServiceProviders = {
  [Service.Auth]: AuthServiceProvider,
  [Service.Database]: DatabaseServiceProvider,
  [Service.Encryption]: EncryptionServiceProvider,
  [Service.Events]: EventsServiceProvider,
  [Service.Session]: SessionServiceProvider,
  [Service.Mailer]: MailServiceProvider,
  [Service.Routing]: RouteServiceProvider,
};

export default coreServiceProviders;
