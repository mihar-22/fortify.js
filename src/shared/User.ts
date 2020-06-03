import AuthProvider from './AuthProvider';
import AuthState from './AuthState';

export type RawUserData = Record<string, any>;

export type Claims = Record<string, any>;

export interface Tokens {
  accessToken: string
  refreshToken: string
  // The number of seconds the access token is valid for.
  expiresIn: number
}

export class User {
  id?: string;

  nickname?: string;

  name?: string;

  email?: string;

  birthday?: Date;

  phoneNumber?: string;

  avatar?: string;

  tokens?: Tokens;

  raw?: RawUserData;

  claims?: Claims;

  state?: AuthState;

  provider?: AuthProvider;

  isEmailVerified = false;

  // Check if the raw data contains the given property.
  public hasRawProperty(property: string) {
    return this.raw?.hasOwnProperty(property);
  }
}
