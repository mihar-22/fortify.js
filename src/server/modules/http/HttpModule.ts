import { AsyncContainerModule } from 'inversify';
import Axios from 'axios';
import { DIToken } from '../../DIToken';
import { HttpClient } from './HttpClient';

export const HttpModule = new AsyncContainerModule(async (bind) => {
  bind<HttpClient>(DIToken.HttpClient)
    .toDynamicValue(() => Axios)
    .inSingletonScope();
});
