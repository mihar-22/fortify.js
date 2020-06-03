import { Service, ServiceProviders } from './services';
import { MailerConfig } from './services/mailer/Mailer';
import ServerlessProvider from './ServerlessProvider';

export default interface Config {
  [id: string]: string | Record<string, any> | undefined
  [Service.Mailer]?: MailerConfig,
  serviceProviders?: ServiceProviders,
  serverlessProvider: ServerlessProvider
}
