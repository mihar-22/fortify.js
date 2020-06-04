import { randomBytes } from 'crypto';
import CryptoEncrypter from '../CryptoEncrypter';
import { CipherAlgorithm } from '../Encrypter';
import { EncryptionError, EncryptionErrorForHuman } from '../EncryptionError';

describe('Encrypter', () => {
  describe('CryptoEncrypter', () => {
    test('basic encryption works', () => {
      const e = new CryptoEncrypter(CryptoEncrypter.generateKey());
      const msg = { foo: 'foo', bar: 2, base: [1, 2, 3] };
      const payload = e.encrypt(msg);
      expect(payload).not.toBe(msg);
      expect(e.decrypt(payload)).toEqual(msg);
    });

    test('raw string encryption works', () => {
      const e = new CryptoEncrypter(CryptoEncrypter.generateKey());
      const payload = e.encryptString('foo');
      expect(payload).not.toBe('foo');
      expect(e.decryptString(payload)).toBe('foo');
    });

    test('encryption using base64 encoded key works', () => {
      const e = new CryptoEncrypter(randomBytes(16).toString('base64'));
      const payload = e.encrypt('foo');
      expect(payload).not.toBe('foo');
      expect(e.decrypt(payload)).toBe('foo');
    });

    test('payload length should be fixed', () => {
      const e = new CryptoEncrypter(CryptoEncrypter.generateKey());
      const lengths: number[] = [];
      Array(100).fill(0).forEach(() => { lengths.push(e.encrypt('foo').length); });
      expect(Math.min(...lengths)).toBe(Math.max(...lengths));
    });

    test('encryption works using aes-256-cbc', () => {
      const e = new CryptoEncrypter(
        CryptoEncrypter.generateKey(CipherAlgorithm.AES256CBC),
        CipherAlgorithm.AES256CBC,
      );
      const payload = e.encrypt('foo');
      expect(payload).not.toBe('foo');
      expect(e.decrypt(payload)).toBe('foo');
    });

    test('should throw given longer key length then supported by aes-128-cbc', () => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _ = new CryptoEncrypter(Buffer.from('a'.repeat(32)).toString('base64'));
      }).toThrow(EncryptionErrorForHuman[EncryptionError.InvalidConfig]);
    });

    test('should throw given shorter key length then supported by aes-128-cbc', () => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _ = new CryptoEncrypter(Buffer.from('a'.repeat(5)).toString('base64'));
      }).toThrow(EncryptionErrorForHuman[EncryptionError.InvalidConfig]);
    });

    test('should throw given longer key length then supported by aes-256-cbc', () => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _ = new CryptoEncrypter(
          Buffer.from('a'.repeat(64)).toString('base64'),
          CipherAlgorithm.AES256CBC,
        );
      }).toThrow(EncryptionErrorForHuman[EncryptionError.InvalidConfig]);
    });

    test('should throw given shorter key length then supported by aes-256-cbc', () => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _ = new CryptoEncrypter(
          Buffer.from('a'.repeat(16)).toString('base64'),
          CipherAlgorithm.AES256CBC,
        );
      }).toThrow(EncryptionErrorForHuman[EncryptionError.InvalidConfig]);
    });

    test('should throw given unsupported cipher', () => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _ = new CryptoEncrypter(
          Buffer.from('a'.repeat(16)).toString('base64'),
          // @ts-ignore
          'bad-cipher',
        );
      }).toThrow(EncryptionErrorForHuman[EncryptionError.InvalidConfig]);
    });

    test('should throw given invalid payload', () => {
      expect(() => {
        const e = new CryptoEncrypter(CryptoEncrypter.generateKey());
        const payload = e.encrypt('foo');
        e.decrypt(payload.split('').sort(() => 0.5 - Math.random()).join(''));
      }).toThrow(EncryptionError.InvalidPayload);
    });

    test('should throw given invalid mac', () => {
      expect(() => {
        const a = new CryptoEncrypter(CryptoEncrypter.generateKey());
        const b = new CryptoEncrypter(CryptoEncrypter.generateKey());
        a.decrypt(b.encrypt('foo'));
      }).toThrow(EncryptionError.InvalidMac);
    });

    test('should throw when iv is too long', () => {
      expect(() => {
        const e = new CryptoEncrypter(CryptoEncrypter.generateKey());
        const payload = e.encrypt('foo');
        const data = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));
        data.iv = `${data.iv}${data.value.substr(0, 32)}`;
        data.value = data.value.slice(1);
        const modifiedPayload = Buffer.from(JSON.stringify(data), 'utf-8').toString('base64');
        e.decrypt(modifiedPayload);
      }).toThrow(EncryptionError.InvalidPayload);
    });
  });
});
