import { CipherAlgorithm } from './Encrypter';

export interface EncryptionConfig {
  key: string,
  cipher?: CipherAlgorithm
}
