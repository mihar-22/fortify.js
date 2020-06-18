import { ModuleProvider } from '../../support/ModuleProvider';
import { App } from '../../App';
import { DIToken } from '../../DIToken';
import { Module } from '../Module';
import { CookieJar } from './CookieJar';

export const CookiesModule: ModuleProvider<undefined> = {
  module: Module.Cookies,

  register: (app: App) => {
    app
      .bind<CookieJar>(DIToken.Cookies)
      .toDynamicValue(() => app.resolve(CookieJar))
      .inRequestScope();
  },
};
