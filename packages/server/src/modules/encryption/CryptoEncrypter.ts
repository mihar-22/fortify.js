import {
  createCipheriv, createDecipheriv, createHmac, randomBytes,
} from 'crypto';
// @ts-ignore
import hashEquals from 'hash-equals';
import { deserialize, serialize } from 'v8';
import {
  CipherAlgorithm,
  CipherIVLength,
  EncryptedPayload,
  Encrypter,
  HashAlgorithm,
} from './Encrypter';
import { EncryptionError, EncryptionErrorBuilder } from './EncryptionError';
import { EncryptionEvent, EncryptionEventDispatcher } from './EncryptionEvent';
import { Event } from '../events/Event';

export class CryptoEncrypter implements Encrypter {
  constructor(
    private readonly key: string,
    private readonly cipherAlgorithm = CipherAlgorithm.AES128CBC,
    private readonly dispatcher: EncryptionEventDispatcher,
  ) {}

  public static generateKey(cipherAlgorithm = CipherAlgorithm.AES128CBC): string {
    return randomBytes(cipherAlgorithm === CipherAlgorithm.AES128CBC ? 16 : 32).toString('base64');
  }

  public static supported(key: string, cipherAlgorithm: CipherAlgorithm) {
    const keyByteLength = Buffer.byteLength(key, 'base64');
    return (cipherAlgorithm === CipherAlgorithm.AES128CBC && keyByteLength === 16)
      || (cipherAlgorithm === CipherAlgorithm.AES256CBC && keyByteLength === 32);
  }

  public encrypt(value: any, shouldSerialize = true): string {
    const iv = randomBytes(CipherIVLength[this.cipherAlgorithm]);
    const cipher = createCipheriv(this.cipherAlgorithm, Buffer.from(this.key, 'base64'), iv);

    this.dispatcher.dispatch(new Event(
      EncryptionEvent.Encrypting,
      '🔏 Encrypting...',
      { payload: value },
    ));

    const encryption = Buffer.concat([
      cipher.update(shouldSerialize ? serialize(value) : value),
      cipher.final(),
    ]).toString('base64');
    // Once we get the encrypted value we'll go ahead and base64 encode the input
    // vector and create the MAC for the encrypted value so we can then verify
    // its authenticity. Then, we'll JSON the data into the "payload" array.
    const mac = this.createMac(iv.toString('base64'), encryption);
    const json = JSON.stringify({ iv: iv.toString('base64'), value: encryption, mac });
    const encryptedPayload = Buffer.from(json).toString('base64');

    this.dispatcher.dispatch(new Event(
      EncryptionEvent.Encrypted,
      '🔐 Encrypted!',
      { payload: encryptedPayload },
    ));

    return encryptedPayload;
  }

  public encryptString(value: string): string {
    return this.encrypt(value, false);
  }

  public decrypt(payload: string, shouldDeserialize = true) {
    const encryptedPayload = this.getJsonPayload(payload);
    const iv = Buffer.from(encryptedPayload.iv, 'base64');
    const decipher = createDecipheriv(this.cipherAlgorithm, Buffer.from(this.key, 'base64'), iv);
    try {
      this.dispatcher.dispatch(new Event(
        EncryptionEvent.Decrypting,
        '🔐 Decrypting...',
        { payload },
      ));

      const decryption = Buffer.concat([
        decipher.update(Buffer.from(encryptedPayload.value, 'base64')),
        decipher.final(),
      ]);

      const decryptedPayload = shouldDeserialize
        ? deserialize(decryption)
        : decryption.toString('utf-8');

      this.dispatcher.dispatch(new Event(
        EncryptionEvent.Decrypted,
        '🔓 Decrypted!',
        { payload: decryptedPayload },
      ));

      return decryptedPayload;
    } catch (e) {
      throw EncryptionErrorBuilder[EncryptionError.InvalidPayload]();
    }
  }

  public decryptString(payload: string) {
    return this.decrypt(payload, false);
  }

  // Create a MAC for the given value.
  protected createMac(iv: string, value: string) {
    return createHmac(HashAlgorithm.SHA256, Buffer.from(this.key, 'base64'))
      .update(`${iv}${value}`)
      .digest('hex');
  }

  protected getJsonPayload(payload: string) {
    let encryptedPayload;
    try {
      encryptedPayload = JSON.parse(Buffer.from(payload, 'base64')
        .toString('utf-8')) as EncryptedPayload;
    } catch (e) {
      throw EncryptionErrorBuilder[EncryptionError.InvalidPayload]();
    }

    if (!this.isPayloadValid(encryptedPayload)) {
      throw EncryptionErrorBuilder[EncryptionError.InvalidPayload]();
    }

    if (!this.isMacValid(encryptedPayload)) {
      throw EncryptionErrorBuilder[EncryptionError.InvalidMac]();
    }

    return encryptedPayload;
  }

  // Verify that the encryption payload is valid.
  protected isPayloadValid(payload: EncryptedPayload) {
    return payload
      && payload.iv
      && payload.value
      && payload.mac
      && (Buffer.byteLength(payload.iv, 'base64') === CipherIVLength[this.cipherAlgorithm]);
  }

  // Determine if the MAC for the given payload is valid.
  protected isMacValid(payload: EncryptedPayload): boolean {
    const bytes = randomBytes(16);
    const calculated = this.calculateMac(payload, bytes);
    const actual = createHmac(HashAlgorithm.SHA256, bytes).update(payload.mac).digest();
    return hashEquals(actual.toString('hex'), calculated.toString('hex'));
  }

  // Calculate the hash of the given payload.
  protected calculateMac(payload: EncryptedPayload, bytes: Buffer) {
    return createHmac(HashAlgorithm.SHA256, bytes)
      .update(this.createMac(payload.iv, payload.value))
      .digest();
  }
}
