import { Request } from '../../routing/Request';
import { Response } from '../../routing/Response';
import User from '../../../../shared/User';
import { Error } from '../../../errors';

// Generally a username or email.
export type Identifier = string | number;

export interface Identity {
  identifier: Identifier
  password: string
}

export interface IdentityProvider {
  request: Request
  response: Response
  constructor(request: Request, response: Response): void
  initialize(): Promise<void>
  signIn(identity: Identity): Promise<Error | undefined>
  signUp(newUser: User): Promise<Error | undefined>
  verifyEmail(email: string, token: string): Promise<Error | undefined>
  resetPassword(
    id: Identifier, token: string, newPassword: string
  ): Promise<Error | undefined>
  markEmailAsVerified(email: string): boolean
  sendEmailVerificationLink?: (user: User) => Promise<void>
  sendPasswordResetLink?: (user: User) => Promise<void>
  // @Todo: link accounts?
  // @Todo: update claims?
}
