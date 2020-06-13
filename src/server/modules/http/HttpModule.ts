import Axios from 'axios';
import { ModuleProvider } from '../../support/ModuleProvider';
import { Module } from '../Module';
import { App } from '../../App';
import { HttpClient } from './HttpClient';
import { DIToken } from '../../DIToken';

export const HttpModule: ModuleProvider<undefined> = {
  module: Module.Http,

  register: (app: App) => {
    app.bind<HttpClient>(DIToken.HttpClient)
      .toDynamicValue(() => Axios)
      .inSingletonScope();
  },
};
