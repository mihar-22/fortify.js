import { Container, ContainerModule } from 'inversify';
import Axios from 'axios';
import { Config, Env } from './Config';
import { DIToken } from './DIToken';
import { coreModules } from './modules';
import { HttpClient } from './support/types';

let hasBootstrapped = false;
let bootstrapping: Promise<void> | undefined;

const coreDependencies = (config?: Config) => new ContainerModule((bind) => {
  bind(DIToken.Config).toConstantValue(config);
  bind<Env>(DIToken.Env).toConstantValue(config?.env ?? Env.Development);
  bind<HttpClient>(DIToken.HttpClient)
    .toDynamicValue(() => Axios)
    .inSingletonScope();
});

export async function bootstrap(container: Container, config?: Config) {
  if (hasBootstrapped) { return; }

  if (bootstrapping) {
    await bootstrapping;
    return;
  }

  container.load(coreDependencies(config));
  const userModules = config?.modules ?? [];
  bootstrapping = container.loadAsync(...[...coreModules, ...userModules]);

  await bootstrapping;
  hasBootstrapped = true;
  bootstrapping = undefined;
}
