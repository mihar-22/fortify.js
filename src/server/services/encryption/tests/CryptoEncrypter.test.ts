import { randomBytes } from 'crypto';
import CryptoEncrypter from '../CryptoEncrypter';
import { CipherAlgorithm } from '../Encrypter';
import { EncryptionError, EncryptionErrorForHuman } from '../EncryptionError';

describe('Encrypter', () => {
  test('basic encryption works', () => {
    const e = new CryptoEncrypter(CryptoEncrypter.generateKey());
    const encrypted = e.encrypt('foo');
    expect(encrypted).not.toBe('foo');
    expect(e.decrypt(encrypted)).toBe('foo');
  });

  test('raw string encryption works', () => {
    const e = new CryptoEncrypter(CryptoEncrypter.generateKey());
    const encrypted = e.encryptString('foo');
    expect(encrypted).not.toBe('foo');
    expect(e.decryptString(encrypted)).toBe('foo');
  });

  test('encryption using base64 encoded key works', () => {
    const e = new CryptoEncrypter(randomBytes(16).toString('base64'));
    const encrypted = e.encrypt('foo');
    expect(encrypted).not.toBe('foo');
    expect(e.decrypt(encrypted)).toBe('foo');
  });

  test('encrypted length should be fixed', () => {
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
    const encrypted = e.encrypt('foo');
    expect(encrypted).not.toBe('foo');
    expect(e.decrypt(encrypted)).toBe('foo');
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
    }).toThrow(EncryptionErrorForHuman[EncryptionError.InvalidConfig]);
  });
});
