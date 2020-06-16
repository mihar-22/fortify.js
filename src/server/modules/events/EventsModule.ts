import { DIToken } from '../../DIToken';
import { Dispatcher } from './Dispatcher';
import { EventDispatcher } from './EventDispatcher';
import { FakeDispatcher } from './FakeDispatcher';
import { ModuleProvider } from '../../support/ModuleProvider';
import { Module } from '../Module';
import { App } from '../../App';
import { EventLogger } from './EventLogger';
import { Logger } from '../logger/Logger';
import { EventsConfig } from './EventsConfig';

export const EventsModule: ModuleProvider<EventsConfig> = {
  module: Module.Events,

  defaults: () => ({
    logEvents: true,
  }),

  register: (app: App) => {
    app
      .bind<Dispatcher>(DIToken.EventDispatcher)
      .toDynamicValue(() => app.resolve(EventDispatcher))
      .inSingletonScope();
  },

  registerTestingEnv: (app: App) => {
    app
      .bind<Dispatcher>(DIToken.FakeDispatcher)
      .toConstantValue(new FakeDispatcher());

    app
      .rebind<Dispatcher>(DIToken.EventDispatcher)
      .toConstantValue(app.get(DIToken.FakeDispatcher));
  },

  boot: async (app: App) => {
    const config = app.getConfig(Module.Events);
    const dispatcher = app.get<Dispatcher>(DIToken.EventDispatcher);

    config?.tap?.({
      listen: dispatcher.listen,
      listenTo: dispatcher.listenTo,
      listenToAll: dispatcher.listenToAll,
    });

    const logger = app.get<Logger>(DIToken.Logger);
    EventLogger.log(logger, dispatcher, config?.logEvents);
  },
};
