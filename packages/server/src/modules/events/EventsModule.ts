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

export class EventsModule implements ModuleProvider<EventsConfig> {
  public static id = Module.Events;

  public static defaults() {
    return {
      logEvents: true,
    };
  }

  constructor(
    private readonly app: App,
    private readonly config: EventsConfig,
  ) {}

  public register() {
    this.app.bindBuilder<() => Dispatcher>(DIToken.EventDispatcher,
      () => this.app.get(EventDispatcher));
  }

  public registerTestingEnv() {
    this.app.bindValue<Dispatcher>(DIToken.FakeDispatcher, new FakeDispatcher());
    this.app.bindValue<Dispatcher>(DIToken.EventDispatcher, this.app.get(DIToken.FakeDispatcher));
  }

  public boot() {
    const dispatcher = this.app.get<Dispatcher>(DIToken.EventDispatcher);

    this.config.tap?.({
      listen: dispatcher.listen,
      listenTo: dispatcher.listenTo,
      listenToAll: dispatcher.listenToAll,
    });

    const logger = this.app.get<Logger>(DIToken.Logger);
    EventLogger.log(logger, dispatcher, this.config.logEvents);
  }
}
