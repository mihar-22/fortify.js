import { DIToken } from '../../../DIToken';
import { Config, Env } from '../../../Config';
import { FakeSmtpClient, Nodemailer, SmtpClientFactory } from '../transporters';
import { MailModule } from '../MailModule';
import { Mailer, MailTransporterFactory } from '../Mailer';
import { FakeMailer } from '../FakeMailer';
import { App } from '../../../App';
import { bootstrap } from '../../../bootstrap';
import { MailError } from '../MailError';
import { Module } from '../../Module';
import { MailTransporter } from '../Mail';
import { coreModules } from '../../index';
import { ModuleProvider } from '../../../support/ModuleProvider';

describe('Mail', () => {
  describe('Module', () => {
    let app: App;

    const boot = (config?: Config, modules?: ModuleProvider<any>[]) => {
      app = bootstrap(modules ?? coreModules, config, true);
      return app;
    };

    test('resolves fake smtp client in testing env', () => {
      boot(({ env: Env.Testing }));
      const clientFactory = app.get<SmtpClientFactory>(DIToken.SmtpClientFactory);
      expect(clientFactory({} as any)).toBeInstanceOf(FakeSmtpClient);
    });

    test('resolves smtp client ', () => {
      boot();
      const clientFactory = app.get<SmtpClientFactory>(DIToken.SmtpClientFactory);
      expect(clientFactory({} as any)).toBeInstanceOf(Nodemailer);
    });

    test('resolves fake mailer in testing env', () => {
      boot(({ env: Env.Testing }));
      const mailer = app.get<Mailer<any>>(DIToken.Mailer);
      expect(mailer).toBeInstanceOf(FakeMailer);
    });

    test('mailer should be singleton scoped', () => {
      boot();
      const mailerA = app.get<Mailer<any>>(DIToken.Mailer);
      const mailerB = app.get<Mailer<any>>(DIToken.Mailer);
      expect(mailerA).toBe(mailerB);
    });

    test('resolves all transporters', () => {
      Object.values(MailTransporter).forEach((transporter) => {
        const cApp = boot({
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
      });
    });

    test('should throw if sandbox is enabled in production', () => {
      expect(() => {
        boot(
          { env: Env.Production, [Module.Mail]: { sandbox: true } },
          [MailModule],
        );
      }).toThrow(MailError.SandboxEnabledInProduction);
    });

    test('should throw if transporter config is missing', () => {
      expect(() => {
        boot(
          {
            env: Env.Production,
            [Module.Mail]: {
              transporter: MailTransporter.Mailgun,
            },
          },
          [MailModule],
        );
      }).toThrow(MailError.MissingTransporterConfig);
    });

    test('should throw if sandbox is disabled and smtp config missing', () => {
      expect(() => {
        boot({
          env: Env.Development,
          [Module.Mail]: {
            transporter: MailTransporter.Smtp,
            sandbox: false,
          },
        });
      }).toThrow(MailError.MissingSmtpConfig);
    });

    test('should throw if mail from is missing in production', () => {
      expect(() => {
        boot(
          {
            env: Env.Production,
            [Module.Mail]: {
              transporter: MailTransporter.Smtp,
              smtp: {} as any,
            },
          },
          [MailModule],
        );
      }).toThrow(MailError.MissingMailFrom);
    });

    test('returns correct smtp dependencies', () => {
      boot({ [Module.Mail]: { transporter: MailTransporter.Smtp } });
      expect(MailModule.dependencies!(app)).toEqual(['nodemailer']);
    });

    test('returns correct dependencies if not smtp', () => {
      boot({
        [Module.Mail]: {
          transporter: MailTransporter.Mailgun,
          [MailTransporter.Mailgun]: {} as any,
        },
      });
      expect(MailModule.dependencies!(app)).toEqual([]);
    });
  });
});
