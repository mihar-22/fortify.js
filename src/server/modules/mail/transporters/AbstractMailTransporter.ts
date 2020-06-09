import { injectable } from 'inversify';
import { Dispatcher } from '../../events';
import { Mail, Mailer, MailSenderFactory } from '../Mailer';
import { MailEvent } from '../MailEvents';
import { Logger } from '../../logger';
import { MailLogs } from '../MailLogs';

@injectable()
export abstract class AbstractMailTransporter implements Mailer {
  protected logger: Logger;

  protected events: Dispatcher;

  protected sender: MailSenderFactory;

  protected constructor(logger: Logger, events: Dispatcher, sender: MailSenderFactory) {
    this.logger = logger;
    this.events = events;
    this.sender = sender;
  }

  abstract async sendMail<T extends object>(mail: Mail<T>): Promise<any>;

  public async send<T extends object>(mail: Mail<T>): Promise<void> {
    this.logger.debug(MailLogs[MailEvent.MailSending](mail));
    this.events.dispatch(MailEvent.MailSending, mail);
    const response = await this.sendMail(mail);
    this.logger.debug(MailLogs[MailEvent.MailSent](mail.subject, mail.to, response));
    this.events.dispatch(MailEvent.MailSent, { mail, response });
  }
}
