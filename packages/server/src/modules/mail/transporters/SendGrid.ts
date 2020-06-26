import { inject, injectable } from 'tsyringe';
import { DIToken } from '../../../DIToken';
import { HttpClient } from '../../http/HttpClient';
import { Mail, MailResponse } from '../Mail';
import { MailTransporter, MailTransporterId } from './MailTransporter';

export interface SendGridConfig {
  apiKey: string
}

export interface SendGridError {
  message: string
  field?: string
  help?: string
}

export interface SendGridResponse extends MailResponse {
  message?: string
  errors?: SendGridError[]
}

@injectable()
export class SendGrid implements MailTransporter<SendGridConfig, SendGridResponse> {
  public id = MailTransporterId.Smtp;

  public config?: SendGridConfig;

  public sandbox = false;

  public sender = '';

  constructor(
    @inject(DIToken.HttpClient) private readonly httpClient: HttpClient,
  ) {}

  public async send(mail: Mail<any>, html?: string): Promise<SendGridResponse> {
    try {
      const response = await this.httpClient(
        'https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          body: JSON.stringify({
            from: {
              name: this.sender.match(/.+</)?.[0].slice(0, -1).trim(),
              email: this.sender.match(/<(.+)>/)?.[1],
            },
            personalizations: [{
              subject: mail.subject,
              to: [{ email: mail.to }],
            }],
            content: [mail.text ? {
              type: 'text/plain',
              value: mail.text,
            } : undefined, html ? {
              type: 'text/html',
              value: html,
            } : undefined].filter(Boolean),
            mail_settings: {
              sandbox_mode: {
                enable: this.sandbox,
              },
            },
          }),
          headers: {
            Authorization: `Bearer ${this.config!.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const jsonRes = (!this.sandbox ? await response.json() : {}) as SendGridResponse;
      return { ...jsonRes, success: response.ok };
    } catch (err) {
      return {
        message: 'Failed to send mail with SendGrid.',
        success: false,
        errors: [{ message: err.message }],
      };
    }
  }
}
