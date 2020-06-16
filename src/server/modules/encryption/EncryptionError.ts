import { HttpError } from '../../support/errors';
import { Module } from '../Module';

export enum EncryptionError {
  InvalidMac = 'INVALID_MAC',
  InvalidPayload = 'INVALID_PAYLOAD',
  MissingEncryptionKey = 'MISSING_ENCRYPTION_KEY',
  UnsupportedCipherAndKeyPair = 'UNSUPPORTED_CIPHER_AND_KEY_PAIR'
}

export const EncryptionErrorBuilder = {
  [EncryptionError.InvalidMac]: () => new HttpError(
    EncryptionError.InvalidMac,
    'The encrypted payload contains an invalid MAC, payload may have been tampered with.',
    Module.Encryption,
    422,
  ),

  [EncryptionError.InvalidPayload]: () => new HttpError(
    EncryptionError.InvalidPayload,
    'The encrypted payload is invalid.',
    Module.Encryption,
    422,
  ),
};
