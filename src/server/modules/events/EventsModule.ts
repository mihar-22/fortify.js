import { DIToken } from '../../DIToken';
import { Dispatcher } from './Dispatcher';
import { EventDispatcher } from './EventDispatcher';
import { FakeDispatcher } from './FakeDispatcher';
import { ModuleProvider } from '../../support/ModuleProvider';
import { Module } from '../Module';
import { App } from '../../App';

export const EventsModule: ModuleProvider<undefined> = {
  module: Module.Events,

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
};
