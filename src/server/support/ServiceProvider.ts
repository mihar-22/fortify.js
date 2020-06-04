import { Container } from 'inversify';

export interface ServiceProvider {
  register(): Promise<void>
}

export interface ServiceProviderConstructor {
  new(container: Container): ServiceProvider
}
