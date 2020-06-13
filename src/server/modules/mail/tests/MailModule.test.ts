import Mail from 'nodemailer/lib/mailer';
import { DIToken } from '../../../DIToken';
import { LoggerModule } from '../../logger/LoggerModule';
import { Config, Env } from '../../../Config';
import { EventsModule } from '../../events/EventsModule';
import { SmtpClientProvider, FakeSmtpClient } from '../transporters';
import { MailModule } from '../MailModule';
import {
  Mailer, MailSenderFactory, MailTransporter, MailTransporterFactory,
} from '../Mailer';
import { FakeMailer } from '../FakeMailer';
import { HttpModule } from '../../http/HttpModule';
import { App } from '../../../App';
import { bootstrap } from '../../../bootstrap';
import { MailConfigError } from '../MailConfig';

describe('Mail', () => {
  describe('Module', () => {
    let app: App;

    const boot = async (config?: Config) => {
      app = await bootstrap([LoggerModule, HttpModule, EventsModule, MailModule], config, true);
      return app;
    };

    test('resolves fake smtp client in testing env', async () => {
      await boot(({ env: Env.Testing }));
      const smtpClientProvider = app.get<SmtpClientProvider>(DIToken.SmtpClientProvider);
      expect(await smtpClientProvider()).toBeInstanceOf(FakeSmtpClient);
    });

    test('resolves smtp client ', async () => {
      await boot(({
        mail: {
          smtp: {
            host: 'smtp.ethereal.email',
            port: 587,
            username: 'Maeve Hagenes',
            password: 'maeve.hagenes@ethereal.email',
          },
        },
      }));
      const smtpClientProvider = app.get<SmtpClientProvider>(DIToken.SmtpClientProvider);
      const smtpClient = await smtpClientProvider();
      expect(smtpClient).toBeInstanceOf(Mail);
    });

    test('should throw in production if from config is missing', async () => {
      await expect(() => boot(({ env: Env.Production })))
        .rejects
        .toThrow(MailConfigError.MissingMailFrom);
    });

    test('should resolve fake sender in development/testing', async () => {
      const fakeSender = 'Test App <no-reply@localhost.com>';
      await boot({ env: Env.Development });
      const devSenderFactory = app.get<MailSenderFactory>(DIToken.MailSenderFactory);
      expect(devSenderFactory()).toBe(fakeSender);
      await boot({ env: Env.Testing });
      const testSenderFactory = app.get<MailSenderFactory>(DIToken.MailSenderFactory);
      expect(testSenderFactory()).toBe(fakeSender);
    });

    test('resolves fake mailer in testing env', async () => {
      await boot(({ env: Env.Testing }));
      const mailer = app.get<Mailer>(DIToken.Mailer);
      expect(mailer).toBeInstanceOf(FakeMailer);
    });

    test('mailer should be singleton scoped', async () => {
      await boot();
      const mailerA = app.get<Mailer>(DIToken.Mailer);
      const mailerB = app.get<Mailer>(DIToken.Mailer);
      expect(mailerA).toBe(mailerB);
    });

    // THROW CHECKS -> DEP + TRANSPORTER CONFIG
    // test('should throw in production if smtp config is missing', async () => {
    //   await loadModule(({ env: Env.Production }));
    //   const smtpClientProvider = container.get<SmtpClientProvider>(DIToken.SmtpClientProvider);
    //   await expect(smtpClientProvider()).rejects.toThrow(MailErrorCode.MissingSmtpConfig);
    // });

    test('resolves all transporters', async () => {
      await Promise.all(Object.values(MailTransporter).map(async (transporter) => {
        // eslint-disable-next-line no-shadow
        const app = await boot({ mail: { transporter } });
        const mailer = app.get<Mailer>(DIToken.Mailer);
        const { constructor } = app
          .get<MailTransporterFactory>(DIToken.MailTransporterFactory)(transporter);
        expect(mailer).toBeInstanceOf(constructor);
      }));
    });
  });
});
