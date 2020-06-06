import { injectable } from 'inversify';
import { Mail, Mailer } from '../Mailer';

@injectable()
export default class SendGrid implements Mailer {
  public async send<T>(mail: Mail<T>): Promise<void> {
    console.log(mail);
  }
}
