import { Container } from 'inversify';
import { EncryptionModule } from '../EncryptionModule';
import { Config, Env } from '../../../Config';
import { DIToken } from '../../../DIToken';
import { EncryptionError, EncryptionErrors } from '../EncryptionErrors';
import { CipherAlgorithm, Encrypter } from '../Encrypter';
import { Module } from '../../Module';
import { FakeEncrypter } from '../FakeEncrypter';

describe('Encryption', () => {
  describe('Module', () => {
    let container: Container;

    const getEncrypterFromContainer = () => container.get<Encrypter>(DIToken.Encrypter);

    const loadModule = async (config?: Config) => {
      container = new Container();
      container.bind(DIToken.Config).toConstantValue(config);
      await container.loadAsync(EncryptionModule);
      getEncrypterFromContainer();
    };

    test('encrypter is singleton scoped', async () => {
      await loadModule();
      const encrypterA = getEncrypterFromContainer();
      const encrypterB = getEncrypterFromContainer();
      expect(encrypterA).toBe(encrypterB);
    });

    test('fake encrypter is resolved in testing env', async () => {
      await loadModule({ env: Env.Testing });
      const encrypter = getEncrypterFromContainer();
      expect(encrypter).toBeInstanceOf(FakeEncrypter);
    });

    test('should throw when missing encryption key in production', () => expect(async () => {
      await loadModule({ env: Env.Production });
    }).rejects.toThrow(EncryptionErrors[EncryptionError.MissingKey]()));

    test('should throw given longer key length then supported by aes-128-cbc', () => expect(async () => {
      await loadModule({
        env: Env.Production,
        [Module.Encryption]: {
          key: Buffer.from('a'.repeat(32)).toString('base64'),
          cipher: CipherAlgorithm.AES128CBC,
        },
      });
    }).rejects.toThrow(EncryptionErrors[EncryptionError.UnsupportedCipherAndKeyPair]()));

    test('should throw given shorter key length then supported by aes-128-cbc', () => expect(async () => {
      await loadModule({
        env: Env.Production,
        [Module.Encryption]: {
          key: Buffer.from('a'.repeat(5)).toString('base64'),
          cipher: CipherAlgorithm.AES128CBC,
        },
      });
    }).rejects.toThrow(EncryptionErrors[EncryptionError.UnsupportedCipherAndKeyPair]()));

    test('should throw given shorter key length then supported by aes-256-cbc', () => expect(async () => {
      await loadModule({
        env: Env.Production,
        [Module.Encryption]: {
          key: Buffer.from('a'.repeat(16)).toString('base64'),
          cipher: CipherAlgorithm.AES256CBC,
        },
      });
    }).rejects.toThrow(EncryptionErrors[EncryptionError.UnsupportedCipherAndKeyPair]()));

    test('should throw given longer key length then supported by aes-256-cbc', () => expect(async () => {
      await loadModule({
        env: Env.Production,
        [Module.Encryption]: {
          key: Buffer.from('a'.repeat(64)).toString('base64'),
          cipher: CipherAlgorithm.AES256CBC,
        },
      });
    }).rejects.toThrow(EncryptionErrors[EncryptionError.UnsupportedCipherAndKeyPair]()));
  });
});
