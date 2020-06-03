import { Container } from 'inversify';
import ServiceProvider from '../../support/ServiceProvider';

export default class DatabaseServiceProvider implements ServiceProvider {
  async register(container: Container) {
    return undefined;
  }
}
