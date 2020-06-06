import { randomBytes } from 'crypto';
import { Container } from 'inversify';
import CryptoEncrypter from '../CryptoEncrypter';
import { CipherAlgorithm } from '../Encrypter';
import { EncryptionError, EncryptionErrorCode } from '../EncryptionError';
import EncryptionModule from '../EncryptionModule';
import Config, { Env } from '../../../Config';
import DIToken from '../../../DIToken';
import Module from '../../Module';

const loadModule = async (config?: Config) => {
  const container = new Container();
  container.bind(DIToken.Config).toConstantValue(config);
  await container.loadAsync(EncryptionModule);
  return container;
};

describe('Encryption', () => {
  describe('CryptoEncrypter', () => {
    test('basic encryption works', async () => {
      const container = await loadModule();
      const encrypter = container.get<CryptoEncrypter>(DIToken.Encrypter);
      const msg = { foo: 'foo', bar: 2, base: [1, 2, 3] };
      const payload = encrypter.encrypt(msg);
      expect(payload).not.toBe(msg);
      expect(encrypter.decrypt(payload)).toEqual(msg);
    });

    test('raw string encryption works', async () => {
      const container = await loadModule();
      const encrypter = container.get<CryptoEncrypter>(DIToken.Encrypter);
      const payload = encrypter.encryptString('foo');
      expect(payload).not.toBe('foo');
      expect(encrypter.decryptString(payload)).toBe('foo');
    });

    test('encryption using base64 encoded key works', async () => {
      const container = await loadModule({
        env: Env.Development,
        [Module.Encryption]: {
          key: randomBytes(16).toString('base64'),
          cipher: CipherAlgorithm.AES128CBC,
        },
      });
      const encrypter = container.get<CryptoEncrypter>(DIToken.Encrypter);
      const payload = encrypter.encrypt('foo');
      expect(payload).not.toBe('foo');
      expect(encrypter.decrypt(payload)).toBe('foo');
    });

    test('payload length should be fixed', async () => {
      const container = await loadModule();
      const encrypter = container.get<CryptoEncrypter>(DIToken.Encrypter);
      const lengths: number[] = [];
      Array(100).fill(0).forEach(() => { lengths.push(encrypter.encrypt('foo').length); });
      expect(Math.min(...lengths)).toBe(Math.max(...lengths));
    });

    test('encryption works using aes-256-cbc', async () => {
      const container = await loadModule({
        env: Env.Development,
        [Module.Encryption]: {
          key: randomBytes(32).toString('base64'),
          cipher: CipherAlgorithm.AES256CBC,
        },
      });
      const encrypter = container.get<CryptoEncrypter>(DIToken.Encrypter);
      const payload = encrypter.encrypt('foo');
      expect(payload).not.toBe('foo');
      expect(encrypter.decrypt(payload)).toBe('foo');
    });

    test('should throw given invalid payload', async () => expect(async () => {
      const container = await loadModule();
      const encrypter = container.get<CryptoEncrypter>(DIToken.Encrypter);
      const payload = encrypter.encrypt('foo');
      encrypter.decrypt(payload.split('').sort(() => 0.5 - Math.random()).join(''));
    }).rejects.toThrow(EncryptionError[EncryptionErrorCode.InvalidPayload]));

    test('should throw given invalid mac', () => expect(async () => {
      const containerA = await loadModule();
      const encrypterA = containerA.get<CryptoEncrypter>(DIToken.Encrypter);
      const containerB = await loadModule();
      const encrypterB = containerB.get<CryptoEncrypter>(DIToken.Encrypter);
      encrypterA.decrypt(encrypterB.encrypt('foo'));
    }).rejects.toThrow(EncryptionError[EncryptionErrorCode.InvalidMac]));

    test('should throw when iv is too long', () => expect(async () => {
      const container = await loadModule();
      const encrypter = container.get<CryptoEncrypter>(DIToken.Encrypter);
      const payload = encrypter.encrypt('foo');
      const data = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));
      data.iv = `${data.iv}${data.value.substr(0, 32)}`;
      data.value = data.value.slice(1);
      const modifiedPayload = Buffer.from(JSON.stringify(data), 'utf-8').toString('base64');
      encrypter.decrypt(modifiedPayload);
    }).rejects.toThrow(EncryptionError[EncryptionErrorCode.InvalidPayload]));
  });
});
