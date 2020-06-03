import { Container } from 'inversify';
import ServiceProvider from '../../support/ServiceProvider';

export default class RouteServiceProvider implements ServiceProvider {
  async register(container: Container) {
    return undefined;
  }
}
