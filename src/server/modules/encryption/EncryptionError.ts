import { HttpError } from '../../support/errors';
import { Module } from '../Module';

export enum EncryptionErrorCode {
  InvalidMac = 'INVALID_MAC',
  InvalidPayload = 'INVALID_PAYLOAD',
}

export const EncryptionError = {
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
};
