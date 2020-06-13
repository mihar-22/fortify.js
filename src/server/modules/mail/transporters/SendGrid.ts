import { inject, injectable } from 'inversify';
import { Mail, MailSenderFactory } from '../Mailer';
import { AbstractMailTransporter } from './AbstractMailTransporter';
import { DIToken } from '../../../DIToken';
import { Dispatcher } from '../../events/Dispatcher';
import { HttpClient } from '../../http/HttpClient';
import { SendGridConfig } from '../MailConfig';

export interface SendGridResponse {
}

@injectable()
export class SendGrid extends AbstractMailTransporter<SendGridResponse> {
  protected readonly config: SendGridConfig;

  protected readonly httpClient: HttpClient;

  constructor(
  @inject(DIToken.SendGridConfig) config: SendGridConfig,
    @inject(DIToken.HttpClient) httpClient: HttpClient,
    @inject(DIToken.EventDispatcher) events: Dispatcher,
    @inject(DIToken.MailSenderFactory) sender: MailSenderFactory,
  ) {
    super(events, sender);
    this.config = config;
    this.httpClient = httpClient;
  }

  public async sendMail(mail: Mail<any>): Promise<SendGridResponse> {
    return Promise.resolve(mail);
  }
}
