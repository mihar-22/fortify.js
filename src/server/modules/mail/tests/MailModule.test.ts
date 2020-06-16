import { DIToken } from '../../../DIToken';
import { LoggerModule } from '../../logger/LoggerModule';
import { Config, Env } from '../../../Config';
import { EventsModule } from '../../events/EventsModule';
import { FakeSmtpClient, Nodemailer, SmtpClientFactory } from '../transporters';
import { MailModule } from '../MailModule';
import { Mailer, MailTransporter, MailTransporterFactory } from '../Mailer';
import { FakeMailer } from '../FakeMailer';
import { HttpModule } from '../../http/HttpModule';
import { App } from '../../../App';
import { bootstrap } from '../../../bootstrap';

describe('Mail', () => {
  describe('Module', () => {
    let app: App;

    const boot = async (config?: Config) => {
      app = await bootstrap([LoggerModule, HttpModule, EventsModule, MailModule], config, true);
      return app;
    };

    test('resolves fake smtp client in testing env', async () => {
      await boot(({ env: Env.Testing }));
      const clientFactory = app.get<SmtpClientFactory>(DIToken.SmtpClientFactory);
      expect(clientFactory({} as any)).toBeInstanceOf(FakeSmtpClient);
    });

    test('resolves smtp client ', async () => {
      await boot();
      const clientFactory = app.get<SmtpClientFactory>(DIToken.SmtpClientFactory);
      expect(clientFactory({} as any)).toBeInstanceOf(Nodemailer);
    });

    test('resolves fake mailer in testing env', async () => {
      await boot(({ env: Env.Testing }));
      const mailer = app.get<Mailer<any>>(DIToken.Mailer);
      expect(mailer).toBeInstanceOf(FakeMailer);
    });

    test('mailer should be singleton scoped', async () => {
      await boot();
      const mailerA = app.get<Mailer<any>>(DIToken.Mailer);
      const mailerB = app.get<Mailer<any>>(DIToken.Mailer);
      expect(mailerA).toBe(mailerB);
    });

    test('resolves all transporters', async () => {
      await Promise.all(Object.values(MailTransporter).map(async (transporter) => {
        const cApp = await boot({ mail: { transporter } });
        const mailer = cApp.get<Mailer<any>>(DIToken.Mailer);
        const { constructor } = cApp
          .get<MailTransporterFactory>(DIToken.MailTransporterFactory)(transporter);
        expect(mailer).toBeInstanceOf(constructor);
      }));
    });

    // Checking defaults.
    // test('resolves fake sender in development/testing', async () => {
    //   const fakeSender = 'Test App <no-reply@localhost.com>';
    //   await boot({ env: Env.Development });
    //   const devSenderFactory = app.get<MailSenderFactory>(DIToken.MailSenderFactory);
    //   expect(devSenderFactory()).toBe(fakeSender);
    //   await boot({ env: Env.Testing });
    //   const testSenderFactory = app.get<MailSenderFactory>(DIToken.MailSenderFactory);
    //   expect(testSenderFactory()).toBe(fakeSender);
    // });

    // THROW CHECKS -> DEP + TRANSPORTER CONFIG
    // test('should throw in production if smtp config is missing', async () => {
    //   await loadModule(({ env: Env.Production }));
    //   const smtpClientProvider = container.get<SmtpClientProvider>(DIToken.SmtpClientProvider);
    //   await expect(smtpClientProvider()).rejects.toThrow(MailErrorCode.MissingSmtpConfig);
    // });
  });
});
