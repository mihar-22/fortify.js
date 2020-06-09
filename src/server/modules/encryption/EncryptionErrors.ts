import { HttpError, Errors, ConfigurationError } from '../../support/errors';
import { Module } from '../Module';

export enum EncryptionError {
  InvalidMac = 'INVALID_MAC',
  InvalidPayload = 'INVALID_PAYLOAD',
  MissingKey = 'MISSING_KEY',
  UnsupportedCipherAndKeyPair = 'UNSUPPORTED_CIPHER_AND_KEY_PAIR'
}

export const EncryptionErrors: Errors<EncryptionError, Module> = {
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
  [EncryptionError.MissingKey]: () => new ConfigurationError(
    EncryptionError.MissingKey,
    'No application encryption key has been specified.',
    Module.Encryption,
    `config.${Module.Encryption}.key`,
  ),
  [EncryptionError.UnsupportedCipherAndKeyPair]: () => new ConfigurationError(
    EncryptionError.UnsupportedCipherAndKeyPair,
    'The only supported ciphers are AES-128-CBC and AES-256-CBC with the correct key lengths.',
    Module.Encryption,
    `config.${Module.Encryption}`,
  ),
};
