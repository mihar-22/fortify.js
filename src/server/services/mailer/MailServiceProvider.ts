import { Container } from 'inversify';
import ServiceProvider from '../../support/ServiceProvider';
import { MailerConfig } from './Mailer';

export default class MailServiceProvider implements ServiceProvider {
  async register(container: Container, config?: MailerConfig) {
    return undefined;
  }
}
