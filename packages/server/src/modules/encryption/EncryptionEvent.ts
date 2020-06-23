import { Dispatcher } from '../events/Dispatcher';

export enum EncryptionEvent {
  Encrypting = 'ENCRYPTION_ENCRYPTING',
  Encrypted = 'ENCRYPTION_ENCRYPTED',
  Decrypting = 'ENCRYPTION_DECRYPTING',
  Decrypted = 'ENCRYPTION_DECRYPTED'
}

export interface EncryptionEventPayload {
  [EncryptionEvent.Encrypting]: { payload: any }
  [EncryptionEvent.Encrypted]: { payload: string }
  [EncryptionEvent.Decrypting]: { payload: string }
  [EncryptionEvent.Decrypted]: { payload: any }
}

export type EncryptionEventDispatcher = Dispatcher<EncryptionEventPayload>;
