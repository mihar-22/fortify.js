import { CipherAlgorithm } from './Encrypter';

export interface EncryptionConfig {
  key: string,
  cipher?: CipherAlgorithm
}

export enum EncryptionConfigError {
  MissingEncryptionKey = 'MISSING_ENCRYPTION_KEY',
  UnsupportedCipherAndKeyPair = 'UNSUPPORTED_CIPHER_AND_KEY_PAIR'
}
