import { EncryptionModule } from '../EncryptionModule';
import { Config, Env } from '../../../Config';
import { DIToken } from '../../../DIToken';
import { CipherAlgorithm, Encrypter } from '../Encrypter';
import { Module } from '../../Module';
import { FakeEncrypter } from '../FakeEncrypter';
import { App } from '../../../App';
import { bootstrap } from '../../../bootstrap';
import { EncryptionConfigError } from '../EncryptionConfig';

describe('Encryption', () => {
  describe('Module', () => {
    let app: App;

    const boot = async (config?: Config) => {
      app = await bootstrap([EncryptionModule], config, true);
    };

    const getEncrypter = () => app.get<Encrypter>(DIToken.Encrypter);

    test('encrypter is singleton scoped', async () => {
      await boot();
      const encrypterA = getEncrypter();
      const encrypterB = getEncrypter();
      expect(encrypterA).toBe(encrypterB);
    });

    test('fake encrypter is resolved in testing env', async () => {
      await boot({ env: Env.Testing });
      const encrypter = getEncrypter();
      expect(encrypter).toBeInstanceOf(FakeEncrypter);
    });

    test('should throw when missing encryption key in production', () => expect(async () => {
      await boot({ env: Env.Production });
    }).rejects.toThrow(EncryptionConfigError.MissingEncryptionKey));

    test('should throw given longer key length then supported by aes-128-cbc', () => expect(async () => {
      await boot({
        env: Env.Production,
        [Module.Encryption]: {
          key: Buffer.from('a'.repeat(32)).toString('base64'),
          cipher: CipherAlgorithm.AES128CBC,
        },
      });
    }).rejects.toThrow(EncryptionConfigError.UnsupportedCipherAndKeyPair));

    test('should throw given shorter key length then supported by aes-128-cbc', () => expect(async () => {
      await boot({
        env: Env.Production,
        [Module.Encryption]: {
          key: Buffer.from('a'.repeat(5)).toString('base64'),
          cipher: CipherAlgorithm.AES128CBC,
        },
      });
    }).rejects.toThrow(EncryptionConfigError.UnsupportedCipherAndKeyPair));

    test('should throw given shorter key length then supported by aes-256-cbc', () => expect(async () => {
      await boot({
        env: Env.Production,
        [Module.Encryption]: {
          key: Buffer.from('a'.repeat(16)).toString('base64'),
          cipher: CipherAlgorithm.AES256CBC,
        },
      });
    }).rejects.toThrow(EncryptionConfigError.UnsupportedCipherAndKeyPair));

    test('should throw given longer key length then supported by aes-256-cbc', () => expect(async () => {
      await boot({
        env: Env.Production,
        [Module.Encryption]: {
          key: Buffer.from('a'.repeat(64)).toString('base64'),
          cipher: CipherAlgorithm.AES256CBC,
        },
      });
    }).rejects.toThrow(EncryptionConfigError.UnsupportedCipherAndKeyPair));
  });
});
