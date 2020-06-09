import { AsyncContainerModule } from 'inversify';
import { DIToken } from '../../DIToken';
import { Config, Env } from '../../Config';
import { Module } from '../Module';
import { CryptoEncrypter } from './CryptoEncrypter';
import { CipherAlgorithm, Encrypter } from './Encrypter';
import { EncryptionErrors, EncryptionError } from './EncryptionErrors';
import { FakeEncrypter } from './FakeEncrypter';

export const EncryptionModule = new AsyncContainerModule(async (bind) => {
  bind<Encrypter>(DIToken.FakeEncrypter)
    .toDynamicValue(() => new FakeEncrypter())
    .inSingletonScope();

  bind<Encrypter>(DIToken.Encrypter)
    .toDynamicValue(({ container }) => {
      const config = container.get<Config>(DIToken.Config);

      if (config?.env === Env.Testing) {
        return container.get(DIToken.FakeEncrypter);
      }

      const encryptConfig = config?.[Module.Encryption];
      let { key, cipher } = encryptConfig ?? {};

      if (config?.env === Env.Production && (!key || key.length === 0)) {
        throw EncryptionErrors[EncryptionError.MissingKey]();
      } else {
        cipher = cipher ?? CipherAlgorithm.AES256CBC;
        key = key ?? CryptoEncrypter.generateKey(cipher);
      }

      if (!CryptoEncrypter.supported(key, cipher)) {
        throw EncryptionErrors[EncryptionError.UnsupportedCipherAndKeyPair]();
      }

      return new CryptoEncrypter(key, cipher);
    })
    .inSingletonScope();
});
