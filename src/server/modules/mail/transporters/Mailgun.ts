import { inject, injectable } from 'inversify';
import { URLSearchParams } from 'url';
import { Mail } from '../Mailer';
import { AbstractMailTransporter } from './AbstractMailTransporter';
import { DIToken } from '../../../DIToken';
import { HttpClient } from '../../http/HttpClient';
import { Dispatcher } from '../../events/Dispatcher';
import { MailgunConfig, MailgunRegion } from '../MailConfig';

export interface MailgunResponse {
  id?: string
  message: string
}

@injectable()
export class Mailgun extends AbstractMailTransporter<MailgunConfig, MailgunResponse> {
  protected readonly httpClient: HttpClient;

  constructor(
  @inject(DIToken.HttpClient) httpClient: HttpClient,
    @inject(DIToken.EventDispatcher) events: Dispatcher,
  ) {
    super(events);
    this.httpClient = httpClient;
  }

  private getBaseUrl(): string {
    const region = this.config!.region ?? MailgunRegion.US;
    return (region === MailgunRegion.US) ? 'api.mailgun.net' : 'api.eu.mailgun.net';
  }

  public async sendMail(mail: Mail<any>, html?: string): Promise<MailgunResponse> {
    try {
      const response = await this.httpClient(
        `https://${this.getBaseUrl()}/v3/${this.config!.domain}/messages`, {
          method: 'POST',
          body: new URLSearchParams({
            from: this.sender,
            to: mail.to,
            subject: mail.subject,
            text: mail.text ?? '',
            html: html ?? '',
            'o:testmode': this.sandbox ? 'yes' : 'no',
          }),
          headers: {
            Authorization: `Basic ${Buffer.from(`api:${this.config!.apiKey}`).toString('base64')}`,
          },
        },
      );

      const textRes = await response.text();
      if (!textRes.startsWith('{')) { return { message: textRes }; }
      return JSON.parse(textRes) as MailgunResponse;
    } catch (err) {
      return { message: 'Internal Mailgun server error' };
    }
  }
}
