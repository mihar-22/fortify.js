import { injectable } from 'inversify';
import { Mail, Mailer } from '../Mailer';

@injectable()
export class Mailgun implements Mailer {
  public async send<T extends object>(mail: Mail<T>): Promise<void> {
    console.log(mail);
  }
}
