import { inject, injectable } from 'tsyringe';
import { URLSearchParams } from 'url';
import { DIToken } from '../../../DIToken';
import { HttpClient } from '../../http/HttpClient';
import { Mail, MailResponse } from '../Mail';
import { MailTransporter, MailTransporterId } from './MailTransporter';

export enum MailgunRegion {
  US = 'us',
  EU = 'eu'
}

export interface MailgunConfig {
  domain: string
  apiKey: string
  region?: MailgunRegion
}

export interface MailgunResponse extends MailResponse {
  id?: string
  message: string
  errors?: string[]
}

@injectable()
export class Mailgun implements MailTransporter<MailgunConfig, MailgunResponse> {
  public id = MailTransporterId.Mailgun;

  public config?: MailgunConfig;

  public sandbox = false;

  public sender = '';

  constructor(
    @inject(DIToken.HttpClient) private readonly httpClient: HttpClient,
  ) {}

  private getBaseUrl(): string {
    const region = this.config!.region ?? MailgunRegion.US;
    return (region === MailgunRegion.US) ? 'api.mailgun.net' : 'api.eu.mailgun.net';
  }

  public async send(mail: Mail<any>, html?: string): Promise<MailgunResponse> {
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
      const isJson = textRes.startsWith('{');
      const jsonRes = isJson ? (JSON.parse(textRes) as MailgunResponse) : { message: textRes };
      return { ...jsonRes, success: response.ok };
    } catch (err) {
      return {
        message: 'Failed to send mail with Mailgun.',
        success: false,
        errors: [err.message],
      };
    }
  }
}
