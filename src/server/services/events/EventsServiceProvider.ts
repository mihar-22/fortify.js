import { Container } from 'inversify';
import ServiceProvider from '../../support/ServiceProvider';

// export interface AuthServerEvents {
//   onSignUp: (user: User) => void
//   onSignIn: (user: User) => void
//   onPasswordReset: (user: User, oldPassword: string, newPassword: string) => void
//   onEmailVerified: (user: User) => void
// }

export default class EventsServiceProvider implements ServiceProvider {
  async register(container: Container) {
    return undefined;
  }
}
