import { ModuleProvider } from '../../support/ModuleProvider';
import { Module } from '../Module';
import { App } from '../../App';
import { buildHttpClient, HttpClient } from './HttpClient';
import { DIToken } from '../../DIToken';
import { buildFakeHttpClient } from './FakeHttpClient';

export const HttpModule: ModuleProvider<undefined> = {
  module: Module.Http,

  register: (app: App) => {
    app.bind<HttpClient>(DIToken.HttpClient)
      .toDynamicValue(buildHttpClient)
      .inSingletonScope();
  },

  registerTestingEnv: (app: App) => {
    app.bind<HttpClient>(DIToken.FakeHttpClient).toConstantValue(buildFakeHttpClient());
    app.rebind<HttpClient>(DIToken.HttpClient).toConstantValue(app.get(DIToken.FakeHttpClient));
  },
};
