import { Container } from 'inversify';
import ServiceProvider from '../../support/ServiceProvider';

export default class EncryptionServiceProvider implements ServiceProvider {
  async register(container: Container) {
    // ...
    // verify key is set and 32 chars long.
  }
}
