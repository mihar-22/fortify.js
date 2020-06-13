export enum CipherAlgorithm {
  AES128CBC = 'aes-128-cbc',
  AES256CBC = 'aes-256-cbc'
}

export enum HashAlgorithm {
  SHA256 = 'sha256'
}

export const CipherIVLength = {
  [CipherAlgorithm.AES128CBC]: 16,
  [CipherAlgorithm.AES256CBC]: 16,
};

export interface EncryptedPayload {
  iv: string
  value: string
  mac: string
}

export interface Encrypter {
  encrypt(value: any, shouldSerialize: boolean): string
  decrypt(payload: string, shouldDeserialize: boolean): any
}
