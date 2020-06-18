import { randomBytes } from 'crypto';
import { CryptoEncrypter } from '../CryptoEncrypter';
import { CipherAlgorithm } from '../Encrypter';
import { EncryptionErrorBuilder, EncryptionError } from '../EncryptionError';
import { EncryptionModule } from '../EncryptionModule';
import { Config, Env } from '../../../Config';
import { DIToken } from '../../../DIToken';
import { Module } from '../../Module';
import { App } from '../../../App';
import { bootstrap } from '../../../bootstrap';

describe('Encryption', () => {
  describe('CryptoEncrypter', () => {
    let app: App;

    const boot = (config?: Config) => {
      app = bootstrap([EncryptionModule], config, true);
    };

    const getEncrypter = () => app.get<CryptoEncrypter>(DIToken.Encrypter);

    beforeEach(() => boot());

    test('basic encryption works', () => {
      const encrypter = getEncrypter();
      const msg = { foo: 'foo', bar: 2, base: [1, 2, 3] };
      const payload = encrypter.encrypt(msg);
      expect(payload).not.toBe(msg);
      expect(encrypter.decrypt(payload)).toEqual(msg);
    });

    test('raw string encryption works', () => {
      const encrypter = getEncrypter();
      const payload = encrypter.encryptString('foo');
      expect(payload).not.toBe('foo');
      expect(encrypter.decryptString(payload)).toBe('foo');
    });

    test('encryption using base64 encoded key works', () => {
      boot({
        env: Env.Development,
        [Module.Encryption]: {
          key: randomBytes(16).toString('base64'),
          cipher: CipherAlgorithm.AES128CBC,
        },
      });
      const encrypter = getEncrypter();
      const payload = encrypter.encrypt('foo');
      expect(payload).not.toBe('foo');
      expect(encrypter.decrypt(payload)).toBe('foo');
    });

    test('payload length should be fixed', () => {
      const encrypter = getEncrypter();
      const lengths: number[] = [];
      Array(100).fill(0).forEach(() => { lengths.push(encrypter.encrypt('foo').length); });
      expect(Math.min(...lengths)).toBe(Math.max(...lengths));
    });

    test('encryption works using aes-256-cbc', () => {
      boot({
        env: Env.Development,
        [Module.Encryption]: {
          key: randomBytes(32).toString('base64'),
          cipher: CipherAlgorithm.AES256CBC,
        },
      });
      const encrypter = getEncrypter();
      const payload = encrypter.encrypt('foo');
      expect(payload).not.toBe('foo');
      expect(encrypter.decrypt(payload)).toBe('foo');
    });

    test('should throw given invalid payload', () => {
      expect(() => {
        const encrypter = getEncrypter();
        const payload = encrypter.encrypt('foo');
        encrypter.decrypt(payload.split('').sort(() => 0.5 - Math.random()).join(''));
      }).toThrow(EncryptionErrorBuilder[EncryptionError.InvalidPayload]());
    });

    test('should throw given invalid mac', async () => {
      await expect(() => {
        boot({ [Module.Encryption]: { key: randomBytes(32).toString('base64') } });
        const encrypterA = getEncrypter();
        boot({ [Module.Encryption]: { key: randomBytes(32).toString('base64') } });
        const encrypterB = getEncrypter();
        expect(encrypterA).not.toBe(encrypterB);
        encrypterA.decrypt(encrypterB.encrypt('foo'));
      }).toThrow(EncryptionErrorBuilder[EncryptionError.InvalidMac]());
    });

    test('should throw when iv is too long', () => {
      expect(() => {
        const encrypter = getEncrypter();
        const payload = encrypter.encrypt('foo');
        const data = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));
        data.iv = `${data.iv}${data.value.substr(0, 32)}`;
        data.value = data.value.slice(1);
        const modifiedPayload = Buffer.from(JSON.stringify(data), 'utf-8').toString('base64');
        encrypter.decrypt(modifiedPayload);
      }).toThrow(EncryptionErrorBuilder[EncryptionError.InvalidPayload]());
    });
  });
});
