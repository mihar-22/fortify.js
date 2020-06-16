import { DIToken } from '../../../DIToken';
import { LoggerModule } from '../../logger/LoggerModule';
import { Config, Env } from '../../../Config';
import { EventsModule } from '../../events/EventsModule';
import { FakeSmtpClient, Nodemailer, SmtpClientFactory } from '../transporters';
import { MailModule } from '../MailModule';
import { Mailer, MailTransporterFactory } from '../Mailer';
import { FakeMailer } from '../FakeMailer';
import { HttpModule } from '../../http/HttpModule';
import { App } from '../../../App';
import { bootstrap } from '../../../bootstrap';
import { MailError } from '../MailError';
import { Module } from '../../Module';
import { MailTransporter } from '../Mail';

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
        const cApp = await boot({
          mail: {
            transporter,
            [MailTransporter.Smtp]: {} as any,
            [MailTransporter.SendGird]: {} as any,
            [MailTransporter.Mailgun]: {} as any,
          },
        });

        const mailer = cApp.get<Mailer<any>>(DIToken.Mailer);
        const { constructor } = cApp
          .get<MailTransporterFactory>(DIToken.MailTransporterFactory)(transporter);
        expect(mailer).toBeInstanceOf(constructor);
      }));
    });

    test('should throw if sandbox is enabled in production', async () => {
      await expect(async () => {
        await boot({ env: Env.Production, [Module.Mail]: { sandbox: true } });
      }).rejects.toThrow(MailError.SandboxEnabledInProduction);
    });

    test('should throw if transporter config is missing', async () => {
      await expect(async () => {
        await boot({
          env: Env.Production,
          [Module.Mail]: {
            transporter: MailTransporter.Mailgun,
          },
        });
      }).rejects.toThrow(MailError.MissingTransporterConfig);
    });

    test('should throw if sandbox is disabled and smtp config missing', async () => {
      await expect(async () => {
        await boot({
          env: Env.Development,
          [Module.Mail]: {
            transporter: MailTransporter.Smtp,
            sandbox: false,
          },
        });
      }).rejects.toThrow(MailError.MissingSmtpConfig);
    });

    test('should throw if mail from is missing in production', async () => {
      await expect(async () => {
        await boot({
          env: Env.Production,
          [Module.Mail]: {
            transporter: MailTransporter.Smtp,
            smtp: {} as any,
          },
        });
      }).rejects.toThrow(MailError.MissingMailFrom);
    });

    test('returns correct smtp dependencies', async () => {
      await boot({ [Module.Mail]: { transporter: MailTransporter.Smtp } });
      expect(MailModule.dependencies!(app)).toEqual(['nodemailer']);
    });

    test('returns correct dependencies if not smtp', async () => {
      await boot({
        [Module.Mail]: {
          transporter: MailTransporter.Mailgun,
          [MailTransporter.Mailgun]: {} as any,
        },
      });
      expect(MailModule.dependencies!(app)).toEqual([]);
    });
  });
});
