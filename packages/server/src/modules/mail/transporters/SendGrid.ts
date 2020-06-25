import { inject, injectable } from 'tsyringe';
import { AbstractMailTransporter } from './AbstractMailTransporter';
import { DIToken } from '../../../DIToken';
import { Dispatcher } from '../../events/Dispatcher';
import { HttpClient } from '../../http/HttpClient';
import { Mail, MailResponse } from '../Mail';

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
export class SendGrid extends AbstractMailTransporter<SendGridConfig, SendGridResponse> {
  constructor(
    @inject(DIToken.HttpClient) protected readonly httpClient: HttpClient,
    @inject(DIToken.EventDispatcher) events: Dispatcher,
  ) {
    super(events);
  }

  public async sendMail(mail: Mail<any>, html?: string): Promise<SendGridResponse> {
    try {
      const response = await this.httpClient(
        'https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          body: JSON.stringify({
            from: {
              name: this.sender?.match(/.+</)?.[0].slice(0, -1).trim(),
              email: this.sender?.match(/<(.+)>/)?.[1],
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
                enable: this.sandbox!,
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
