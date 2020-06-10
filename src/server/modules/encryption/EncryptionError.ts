import {
  HttpError,
  ConfigurationError,
  ErrorContextRecord,
  ErrorBuilderRecord,
} from '../../support/errors';
import { Module } from '../Module';

export enum EncryptionErrorCode {
  InvalidMac = 'INVALID_MAC',
  InvalidPayload = 'INVALID_PAYLOAD',
  MissingKey = 'MISSING_KEY',
  UnsupportedCipherAndKeyPair = 'UNSUPPORTED_CIPHER_AND_KEY_PAIR'
}

export interface EncryptionErrorContext extends ErrorContextRecord<EncryptionErrorCode> {
  [EncryptionErrorCode.InvalidMac]: {}
  [EncryptionErrorCode.InvalidPayload]: {}
  [EncryptionErrorCode.MissingKey]: {}
  [EncryptionErrorCode.UnsupportedCipherAndKeyPair]: {}
}

export const EncryptionError: ErrorBuilderRecord<EncryptionErrorCode, EncryptionErrorContext> = {
  [EncryptionErrorCode.InvalidMac]: () => new HttpError(
    EncryptionErrorCode.InvalidMac,
    'The encrypted payload contains an invalid MAC, payload may have been tampered with.',
    Module.Encryption,
    422,
  ),

  [EncryptionErrorCode.InvalidPayload]: () => new HttpError(
    EncryptionErrorCode.InvalidPayload,
    'The encrypted payload is invalid.',
    Module.Encryption,
    422,
  ),

  [EncryptionErrorCode.MissingKey]: () => new ConfigurationError(
    EncryptionErrorCode.MissingKey,
    'No application encryption key has been specified.',
    Module.Encryption,
    `config.${Module.Encryption}.key`,
  ),

  [EncryptionErrorCode.UnsupportedCipherAndKeyPair]: () => new ConfigurationError(
    EncryptionErrorCode.UnsupportedCipherAndKeyPair,
    'The only supported ciphers are AES-128-CBC and AES-256-CBC with the correct key lengths.',
    Module.Encryption,
    `config.${Module.Encryption}`,
  ),
};
