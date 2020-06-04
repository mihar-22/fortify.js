import { Container } from 'inversify';
import Config, { Env } from './Config';
import DI from './DI';
import { Service } from './services/Service';
import coreServiceProviders from './services';

let hasBootstrapped = false;
let pendingBootstrap: Promise<any[]> | undefined;

export default async function bootstrap(container: Container, config: Config) {
  if (hasBootstrapped && config.env !== Env.Testing) { return; }

  if (pendingBootstrap) {
    await pendingBootstrap;
    return;
  }

  container.bind(DI.Config).toConstantValue(config);

  const userDefinedServiceProviders = config?.serviceProviders || {};
  const serviceProviders = { ...coreServiceProviders, ...userDefinedServiceProviders };

  const registrations = Object.keys(serviceProviders)
    .map(async (id) => {
      const ServiceProvider = serviceProviders[id as Service]!;
      const serviceProvider = new ServiceProvider(container);
      return serviceProvider!.register();
    });

  pendingBootstrap = Promise.all(registrations);
  await pendingBootstrap;
  hasBootstrapped = true;
  pendingBootstrap = undefined;
}
