import { Container } from 'inversify';
import EncryptionModule from '../EncryptionModule';
import Config, { Env } from '../../../Config';
import DIToken from '../../../DIToken';
import { EncryptionError, EncryptionErrorCode } from '../EncryptionError';
import { CipherAlgorithm, Encrypter } from '../Encrypter';
import Module from '../../Module';

const loadWithConfig = async (config: Config) => {
  const container = new Container();
  container.bind<Config>(DIToken.Config).toConstantValue(config);
  await container.loadAsync(EncryptionModule);
  container.get<Encrypter>(DIToken.Encrypter);
};

describe('Encryption', () => {
  describe('Module', () => {
    test('should throw when missing encryption key in production', () => expect(async () => {
      await loadWithConfig({ env: Env.Production });
    }).rejects.toThrow(EncryptionError[EncryptionErrorCode.MissingKey]));

    test('should throw given longer key length then supported by aes-128-cbc', () => expect(async () => {
      await loadWithConfig({
        env: Env.Production,
        [Module.Encryption]: {
          key: Buffer.from('a'.repeat(32)).toString('base64'),
          cipher: CipherAlgorithm.AES128CBC,
        },
      });
    }).rejects.toThrow(EncryptionError[EncryptionErrorCode.UnsupportedCipherAndKeyPair]));

    test('should throw given shorter key length then supported by aes-128-cbc', () => expect(async () => {
      await loadWithConfig({
        env: Env.Production,
        [Module.Encryption]: {
          key: Buffer.from('a'.repeat(5)).toString('base64'),
          cipher: CipherAlgorithm.AES128CBC,
        },
      });
    }).rejects.toThrow(EncryptionError[EncryptionErrorCode.UnsupportedCipherAndKeyPair]));

    test('should throw given shorter key length then supported by aes-256-cbc', () => expect(async () => {
      await loadWithConfig({
        env: Env.Production,
        [Module.Encryption]: {
          key: Buffer.from('a'.repeat(16)).toString('base64'),
          cipher: CipherAlgorithm.AES256CBC,
        },
      });
    }).rejects.toThrow(EncryptionError[EncryptionErrorCode.UnsupportedCipherAndKeyPair]));

    test('should throw given longer key length then supported by aes-256-cbc', () => expect(async () => {
      await loadWithConfig({
        env: Env.Production,
        [Module.Encryption]: {
          key: Buffer.from('a'.repeat(64)).toString('base64'),
          cipher: CipherAlgorithm.AES256CBC,
        },
      });
    }).rejects.toThrow(EncryptionError[EncryptionErrorCode.UnsupportedCipherAndKeyPair]));
  });
});
