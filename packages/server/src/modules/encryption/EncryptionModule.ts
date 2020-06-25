import { ModuleProvider } from '../../support/ModuleProvider';
import { CipherAlgorithm, Encrypter } from './Encrypter';
import { Module } from '../Module';
import { CryptoEncrypter } from './CryptoEncrypter';
import { App } from '../../App';
import { DIToken } from '../../DIToken';
import { FakeEncrypter } from './FakeEncrypter';
import { EncryptionConfig } from './EncryptionConfig';
import { EncryptionError } from './EncryptionError';

export class EncryptionModule implements ModuleProvider<EncryptionConfig> {
  public static id = Module.Encryption;

  public static defaults() {
    return {
      key: Buffer.from('s'.repeat(32)).toString('base64'),
      cipher: CipherAlgorithm.AES256CBC,
    };
  }

  constructor(
    private readonly app: App,
    private readonly config: EncryptionConfig,
  ) {}

  public configValidation() {
    const { key, cipher } = this.config;

    const isBadProductionKey = !key
      || key.length === 0
      || key === Buffer.from('s'.repeat(32)).toString('base64');

    if (this.app.isProductionEnv && isBadProductionKey) {
      return {
        code: EncryptionError.MissingEncryptionKey,
        message: 'Your application is vulnerable because no encryption key has been specified.',
        path: 'key',
      };
    }

    if (!CryptoEncrypter.supported(key!, cipher!)) {
      return {
        code: EncryptionError.UnsupportedCipherAndKeyPair,
        message: 'The only supported ciphers are AES-128-CBC and AES-256-CBC with the correct key lengths.',
      };
    }

    return undefined;
  }

  public register() {
    this.app.bindBuilder<() => Encrypter>(DIToken.Encrypter, () => {
      const { key, cipher } = this.config;
      return new CryptoEncrypter(key, cipher, this.app.get(DIToken.EventDispatcher));
    });
  }

  public registerTestingEnv() {
    this.app.bindValue<Encrypter>(DIToken.FakeEncrypter, new FakeEncrypter());
    this.app.bindValue<Encrypter>(DIToken.Encrypter, this.app.get(DIToken.FakeEncrypter));
  }
}
