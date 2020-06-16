import { inject, injectable } from 'inversify';
import { Mail } from '../Mailer';
import { AbstractMailTransporter } from './AbstractMailTransporter';
import { DIToken } from '../../../DIToken';
import { Dispatcher } from '../../events/Dispatcher';
import { HttpClient } from '../../http/HttpClient';
import { SendGridConfig } from '../MailConfig';

export interface SendGridResponse {
}

@injectable()
export class SendGrid extends AbstractMailTransporter<SendGridConfig, SendGridResponse> {
  protected readonly httpClient: HttpClient;

  constructor(
  @inject(DIToken.HttpClient) httpClient: HttpClient,
    @inject(DIToken.EventDispatcher) events: Dispatcher,
  ) {
    super(events);
    this.httpClient = httpClient;
  }

  public configure(config: SendGridConfig, sandbox: boolean) {
    this.config = config;
    this.sandbox = sandbox;
  }

  public async sendMail(mail: Mail<any>): Promise<SendGridResponse> {
    return Promise.resolve(mail);
  }
}
