import { inject, injectable } from 'inversify';
import { Mail, MailSenderFactory } from '../Mailer';
import { AbstractMailTransporter } from './AbstractMailTransporter';
import { DIToken } from '../../../DIToken';
import { HttpClient } from '../../http/HttpClient';
import { Dispatcher } from '../../events/Dispatcher';

export interface MailgunResponse {
}

@injectable()
export class Mailgun extends AbstractMailTransporter<MailgunResponse> {
  protected readonly httpClient: HttpClient;

  constructor(
  @inject(DIToken.HttpClient) httpClient: HttpClient,
    @inject(DIToken.EventDispatcher) events: Dispatcher,
    @inject(DIToken.MailSenderFactory) sender: MailSenderFactory,
  ) {
    super(events, sender);
    this.httpClient = httpClient;
  }

  public async sendMail(mail: Mail<any>): Promise<MailgunResponse> {
    return Promise.resolve(mail);
  }
}
