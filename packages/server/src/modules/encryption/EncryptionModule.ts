import { ModuleProvider } from '../../support/ModuleProvider';
import { CipherAlgorithm, Encrypter } from './Encrypter';
import { Module } from '../Module';
import { CryptoEncrypter } from './CryptoEncrypter';
import { App } from '../../App';
import { DIToken } from '../../DIToken';
import { FakeEncrypter } from './FakeEncrypter';
import { EncryptionConfig } from './EncryptionConfig';
import { EncryptionError } from './EncryptionError';

export const EncryptionModule: ModuleProvider<EncryptionConfig> = {
  module: Module.Encryption,

  defaults: () => ({
    key: Buffer.from('s'.repeat(32)).toString('base64'),
    cipher: CipherAlgorithm.AES256CBC,
  }),

  configValidation: (app: App) => {
    const encryptionConfig = app.getConfig(Module.Encryption)!;
    const { key, cipher } = encryptionConfig;

    const isBadProductionKey = !key
      || key.length === 0
      || key === Buffer.from('s'.repeat(32)).toString('base64');

    if (app.isProductionEnv && isBadProductionKey) {
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
  },

  register: (app: App) => {
    const encryptionConfig = app.getConfig(Module.Encryption)!;

    app
      .bind<Encrypter>(DIToken.Encrypter)
      .toDynamicValue(() => {
        const { key, cipher } = encryptionConfig;
        return new CryptoEncrypter(key, cipher);
      })
      .inSingletonScope();
  },

  registerTestingEnv: (app: App) => {
    app.bind<Encrypter>(DIToken.FakeEncrypter).toConstantValue(new FakeEncrypter());
    app.rebind<Encrypter>(DIToken.Encrypter).toConstantValue(app.get(DIToken.FakeEncrypter));
  },
};
