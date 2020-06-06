import { AsyncContainerModule } from 'inversify';
import DIToken from '../../DIToken';
import Config, { Env } from '../../Config';
import Module from '../Module';
import CryptoEncrypter from './CryptoEncrypter';
import { CipherAlgorithm, Encrypter } from './Encrypter';
import { EncryptionError, EncryptionErrorCode } from './EncryptionError';

const EncryptionModule = new AsyncContainerModule(async (bind) => {
  bind<Encrypter>(DIToken.Encrypter)
    .toDynamicValue((context) => {
      const config = context.container.get<Config>(DIToken.Config);
      const encryptConfig = config?.[Module.Encryption]!;
      let { key, cipher } = encryptConfig ?? {};

      if (config?.env === Env.Production && (!key || key.length === 0)) {
        throw EncryptionError[EncryptionErrorCode.MissingKey];
      } else {
        cipher = cipher ?? CipherAlgorithm.AES256CBC;
        key = key ?? CryptoEncrypter.generateKey(cipher);
      }

      if (!CryptoEncrypter.supported(key, cipher)) {
        throw EncryptionError[EncryptionErrorCode.UnsupportedCipherAndKeyPair];
      }

      return new CryptoEncrypter(key, cipher);
    })
    .inSingletonScope();
});

export default EncryptionModule;
