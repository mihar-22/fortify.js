import { Container } from 'inversify';
import { ServiceProvider } from '../../support/ServiceProvider';

export default class SessionServiceProvider implements ServiceProvider {
  protected container: Container;

  constructor(container: Container) {
    this.container = container;
  }

  public register(): Promise<void> {
    return Promise.resolve(undefined);
  }
}
