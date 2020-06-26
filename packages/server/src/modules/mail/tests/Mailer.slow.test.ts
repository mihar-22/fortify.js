import { Config, Env } from '../../../Config';
import { bootstrap } from '../../../bootstrap';
import { Module } from '../../Module';
import { DIToken } from '../../../DIToken';
import { coreModules } from '../../index';
import {
  Mailgun, MailTransporterId, SendGrid, Smtp,
} from '../transporters';

describe('Mail', () => {
  describe('Mailer', () => {
    const boot = (config?: Config) => bootstrap(coreModules, config, true);

    const mail = {
      subject: 'Subject',
      to: process.env.MAILGUN_AUTHORIZED_RECIPIENT!,
      text: 'Apples.',
    };

    test('smtp', async () => {
      // Server is slow.
      jest.setTimeout(10000);

      const app = boot({
        env: Env.Development,
        [Module.Mail]: {
          transporter: MailTransporterId.Smtp,
        },
      });

      const transporter = app.get<Smtp>(DIToken.MailTransporter);
      const response = await transporter.send(mail);
      expect(response).toBeDefined();
      expect(response.success).toBeTruthy();
      expect(response.messageId).toBeDefined();
    });

    test('mailgun', async () => {
      const app = boot({
        env: Env.Development,
        [Module.Mail]: {
          transporter: MailTransporterId.Mailgun,
          [MailTransporterId.Mailgun]: {
            domain: process.env.MAILGUN_DOMAIN!,
            apiKey: process.env.MAILGUN_API_KEY!,
          },
        },
      });

      const transporter = app.get<Mailgun>(DIToken.MailTransporter);
      const response = await transporter.send(mail);
      expect(response).toBeDefined();
      expect(response.success).toBeTruthy();
    });

    test('sendgrid', async () => {
      const app = boot({
        env: Env.Development,
        [Module.Mail]: {
          transporter: MailTransporterId.SendGird,
          [MailTransporterId.SendGird]: {
            apiKey: process.env.SENDGRID_API_KEY!,
          },
        },
      });

      const transporter = app.get<SendGrid>(DIToken.MailTransporter);
      const response = await transporter.send(mail);
      expect(response).toBeDefined();
      expect(response.success).toBeTruthy();
    });
  });
});
