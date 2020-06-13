import { inject, injectable } from 'inversify';
import { Mail, MailSenderFactory } from '../Mailer';
import { AbstractMailTransporter } from './AbstractMailTransporter';
import { DIToken } from '../../../DIToken';
import { HttpClient } from '../../http/HttpClient';
import { Dispatcher } from '../../events/Dispatcher';
import { MailgunConfig } from '../MailConfig';

export interface MailgunResponse {

}

@injectable()
export class Mailgun extends AbstractMailTransporter<MailgunResponse> {
  protected readonly config: MailgunConfig;

  protected readonly httpClient: HttpClient;

  constructor(
  @inject(DIToken.MailgunConfig) config: MailgunConfig,
    @inject(DIToken.HttpClient) httpClient: HttpClient,
    @inject(DIToken.EventDispatcher) events: Dispatcher,
    @inject(DIToken.MailSenderFactory) sender: MailSenderFactory,
  ) {
    super(events, sender);
    this.config = config;
    this.httpClient = httpClient;
  }

  public async sendMail(mail: Mail<any>): Promise<MailgunResponse> {
    return Promise.resolve(mail);
  }
}
