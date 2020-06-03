import 'reflect-metadata';
import { Container } from 'inversify';
import { defaultServiceProviders, Service } from './services';
import Config from './config';

const container = new Container();

export default async function serverlessAuth(config?: Config) {
  const userDefinedServiceProviders = config?.serviceProviders || {};
  const serviceProviders = { ...defaultServiceProviders, ...userDefinedServiceProviders };

  const registrations = Object.keys(serviceProviders)
    .map(async (id) => serviceProviders[id as Service]!.register(container, config?.[id]));

  await Promise.all(registrations);

  // get router handler endpoint and return it
}
