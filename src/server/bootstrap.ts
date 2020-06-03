import { Container } from 'inversify';
import Config from './Config';
import { defaultServiceProviders, Service } from './services';

export default function async(container: Container, config?: Config) {
  const userDefinedServiceProviders = config?.serviceProviders || {};
  const serviceProviders = { ...defaultServiceProviders, ...userDefinedServiceProviders };

  const registrations = Object.keys(serviceProviders)
    .map(async (id) => serviceProviders[id as Service]!.register(container, config?.[id]));

  return Promise.all(registrations);
}
