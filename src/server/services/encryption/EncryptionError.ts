import { HttpErrors } from '../routing/HttpError';

export enum EncryptionError {
  InvalidPayload = 'ENCRYPTION__INVALID_PAYLOAD',
  InvalidMac = 'ENCRYPTION__INVALID_MAC',
  InvalidConfig = 'ENCRYPTION__INVALID_CONFIG',
  MissingKey = 'ENCRYPTION__MISSING_KEY'
}

export const EncryptionErrorForHuman = {
  [EncryptionError.InvalidConfig]: 'The only supported ciphers are AES-128-CBC and AES-256-CBC with the correct key lengths.',
  [EncryptionError.MissingKey]: 'No application encryption key has been specified.',
};

export const EncryptionErrorForHttp: HttpErrors = {
  [EncryptionError.InvalidPayload]: {
    message: 'The encrypted payload is invalid.',
    statusCode: 422,
  },
  [EncryptionError.InvalidMac]: {
    message: 'The encrypted payload contains an invalid MAC, payload may have been tampered with.',
    statusCode: 422,
  },
};
