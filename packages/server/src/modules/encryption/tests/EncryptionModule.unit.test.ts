import { Config, Env } from '../../../Config';
import { DIToken } from '../../../DIToken';
import { CipherAlgorithm, Encrypter } from '../Encrypter';
import { Module } from '../../Module';
import { FakeEncrypter } from '../FakeEncrypter';
import { App } from '../../../App';
import { bootstrap } from '../../../bootstrap';
import { EncryptionError } from '../EncryptionError';
import { coreModules } from '../../index';

describe('Encryption', () => {
  describe('Module', () => {
    let app: App;

    const boot = (config?: Config) => {
      app = bootstrap(coreModules, config, true);
    };

    const getEncrypter = () => app.get<Encrypter>(DIToken.Encrypter);

    test('encrypter is singleton scoped', () => {
      boot();
      const encrypterA = getEncrypter();
      const encrypterB = getEncrypter();
      expect(encrypterA).toBe(encrypterB);
    });

    test('fake encrypter is resolved in testing env', () => {
      boot({ env: Env.Testing });
      const encrypter = getEncrypter();
      expect(encrypter).toBeInstanceOf(FakeEncrypter);
    });

    test('should throw when missing encryption key in production', () => expect(() => {
      boot({ env: Env.Production });
    }).toThrow(EncryptionError.MissingEncryptionKey));

    test('should throw given longer key length then supported by aes-128-cbc', () => expect(() => {
      boot({
        env: Env.Production,
        [Module.Encryption]: {
          key: Buffer.from('a'.repeat(32)).toString('base64'),
          cipher: CipherAlgorithm.AES128CBC,
        },
      });
    }).toThrow(EncryptionError.UnsupportedCipherAndKeyPair));

    test('should throw given shorter key length then supported by aes-128-cbc', () => expect(() => {
      boot({
        env: Env.Production,
        [Module.Encryption]: {
          key: Buffer.from('a'.repeat(5)).toString('base64'),
          cipher: CipherAlgorithm.AES128CBC,
        },
      });
    }).toThrow(EncryptionError.UnsupportedCipherAndKeyPair));

    test('should throw given shorter key length then supported by aes-256-cbc', () => expect(() => {
      boot({
        env: Env.Production,
        [Module.Encryption]: {
          key: Buffer.from('a'.repeat(16)).toString('base64'),
          cipher: CipherAlgorithm.AES256CBC,
        },
      });
    }).toThrow(EncryptionError.UnsupportedCipherAndKeyPair));

    test('should throw given longer key length then supported by aes-256-cbc', () => expect(() => {
      boot({
        env: Env.Production,
        [Module.Encryption]: {
          key: Buffer.from('a'.repeat(64)).toString('base64'),
          cipher: CipherAlgorithm.AES256CBC,
        },
      });
    }).toThrow(EncryptionError.UnsupportedCipherAndKeyPair));
  });
});
