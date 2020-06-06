import { AsyncContainerModule } from 'inversify';
import DIToken from '../../DIToken';
import Dispatcher from './Dispatcher';
import EventDispatcher from './EventDispatcher';

const EventsModule = new AsyncContainerModule(async (bind) => {
  bind<Dispatcher>(DIToken.EventDispatcher)
    .to(EventDispatcher)
    .inSingletonScope();
});

export default EventsModule;
