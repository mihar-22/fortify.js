import { Container } from 'inversify';
import { ServiceProvider } from '../../support/ServiceProvider';
import DI from '../../DI';
import Config from '../../Config';
import { EncryptionError, EncryptionErrorForHuman } from './EncryptionError';
import { Service } from '../Service';
import CryptoEncrypter from './CryptoEncrypter';
import { CipherAlgorithm, Encrypter } from './Encrypter';

export default class EncryptionServiceProvider implements ServiceProvider {
  protected container: Container;

  constructor(container: Container) {
    this.container = container;
  }

  public async register() {
    this.registerEncrypter();
  }

  protected registerEncrypter() {
    this.container
      .bind<Encrypter>(DI.Encrypter)
      .toDynamicValue((context) => {
        const config = context.container.get<Config>(DI.Config);
        const key = config?.[Service.Encryption]?.key;
        const cipher = config?.[Service.Encryption]?.cipher;
        if (!key || key.length === 0) {
          throw new Error(EncryptionErrorForHuman[EncryptionError.MissingKey]);
        }
        return new CryptoEncrypter(key, cipher ?? CipherAlgorithm.AES256CBC);
      })
      .inSingletonScope();
  }
}
