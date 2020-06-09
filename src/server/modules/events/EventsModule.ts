import { AsyncContainerModule } from 'inversify';
import { DIToken } from '../../DIToken';
import { Dispatcher } from './Dispatcher';
import { EventDispatcher } from './EventDispatcher';
import { Config, Env } from '../../Config';
import { FakeDispatcher } from './FakeDispatcher';

export const EventsModule = new AsyncContainerModule(async (bind) => {
  bind<Dispatcher>(DIToken.FakeDispatcher)
    .toDynamicValue(() => new FakeDispatcher())
    .inSingletonScope();

  bind<Dispatcher>(DIToken.EventDispatcher)
    .toDynamicValue(({ container }) => {
      const config = container.get<Config>(DIToken.Config);

      return (config?.env === Env.Testing)
        ? container.get(DIToken.FakeDispatcher)
        : container.resolve(EventDispatcher);
    })
    .inSingletonScope();
});
