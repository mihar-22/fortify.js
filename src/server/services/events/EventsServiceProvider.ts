import { Container } from 'inversify';
import { ServiceProvider } from '../../support/ServiceProvider';
import DI from '../../DI';
import Dispatcher from './Dispatcher';
import EventDispatcher from './EventDispatcher';

export default class EventsServiceProvider implements ServiceProvider {
  protected container: Container;

  constructor(container: Container) {
    this.container = container;
  }

  public async register() {
    this.container.bind<Dispatcher>(DI.Events).to(EventDispatcher);
  }
}
