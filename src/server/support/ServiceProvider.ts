import { Container } from 'inversify';

export default interface ServiceProvider {
  register<T>(container: Container, config?: T): Promise<void>
}
