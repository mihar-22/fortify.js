import { inject, injectable } from 'inversify';
import { Mail, MailSenderFactory } from '../Mailer';
import { AbstractMailTransporter } from './AbstractMailTransporter';
import { DIToken } from '../../../DIToken';
import { Logger } from '../../logger/Logger';
import { Dispatcher } from '../../events/Dispatcher';
import { HttpClient } from '../../http/HttpClient';

@injectable()
export class SendGrid extends AbstractMailTransporter<object> {
  protected readonly httpClient: HttpClient;

  constructor(
  @inject(DIToken.HttpClient) httpClient: HttpClient,
    @inject(DIToken.Logger) logger: Logger,
    @inject(DIToken.EventDispatcher) events: Dispatcher,
    @inject(DIToken.MailSenderFactory) sender: MailSenderFactory,
  ) {
    super(logger, events, sender);
    this.httpClient = httpClient;
  }

  public async sendMail(mail: Mail<any>): Promise<object> {
    console.log(this.sender());
    return Promise.resolve(mail);
  }
}
