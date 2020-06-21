import { AuthProvider } from './AuthProvider';
import { AuthState } from './AuthState';

export type RawUserData = Record<string, any>;

export type Claims = Record<string, any>;

export interface Tokens {
  accessToken: string
  refreshToken: string
  // The number of seconds the access token is valid for.
  expiresIn: number
}

export class User {
  public id?: string;

  public nickname?: string;

  public name?: string;

  public email?: string;

  public birthday?: Date;

  public phoneNumber?: string;

  public avatar?: string;

  public tokens?: Tokens;

  public raw?: RawUserData;

  public claims?: Claims;

  public state?: AuthState;

  public provider?: AuthProvider;

  public isEmailVerified = false;

  // Check if the raw data contains the given property.
  public hasRawProperty(property: string) {
    return this.raw?.hasOwnProperty(property);
  }
}
