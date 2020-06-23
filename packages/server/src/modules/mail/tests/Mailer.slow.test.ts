import { MailTransporterFactory } from '../Mailer';
import { Config, Env } from '../../../Config';
import { bootstrap } from '../../../bootstrap';
import { Module } from '../../Module';
import { MailTransporter } from '../Mail';
import { DIToken } from '../../../DIToken';
import { coreModules } from '../../index';

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
          transporter: MailTransporter.Smtp,
        },
      });

      const mailer = app.get<MailTransporterFactory>(
        DIToken.MailTransporterFactory,
      )(MailTransporter.Smtp);

      const response = await mailer.send(mail);
      expect(response).toBeDefined();
      expect(response.success).toBeTruthy();
      expect(response.messageId).toBeDefined();
    });

    test('mailgun', async () => {
      const app = boot({
        env: Env.Development,
        [Module.Mail]: {
          transporter: MailTransporter.Mailgun,
          [MailTransporter.Mailgun]: {
            domain: process.env.MAILGUN_DOMAIN!,
            apiKey: process.env.MAILGUN_API_KEY!,
          },
        },
      });

      const mailer = app.get<MailTransporterFactory>(
        DIToken.MailTransporterFactory,
      )(MailTransporter.Mailgun);

      const response = await mailer.send(mail);
      expect(response).toBeDefined();
      expect(response.success).toBeTruthy();
    });

    test('sendgrid', async () => {
      const app = boot({
        env: Env.Development,
        [Module.Mail]: {
          transporter: MailTransporter.SendGird,
          [MailTransporter.SendGird]: {
            apiKey: process.env.SENDGRID_API_KEY!,
          },
        },
      });

      const mailer = app.get<MailTransporterFactory>(
        DIToken.MailTransporterFactory,
      )(MailTransporter.SendGird);

      const response = await mailer.send(mail);
      expect(response).toBeDefined();
      expect(response.success).toBeTruthy();
    });
  });
});
