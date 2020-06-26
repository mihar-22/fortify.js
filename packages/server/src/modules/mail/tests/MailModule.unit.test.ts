import { DIToken } from '../../../DIToken';
import { Config, Env } from '../../../Config';
import {
  FakeMailTransporter,
  FakeSmtpClient,
  MailTransporter, MailTransporterFactory,
  MailTransporterId,
  Nodemailer,
  SmtpClientFactory,
} from '../transporters';
import { MailModule } from '../MailModule';
import { Mailer } from '../Mailer';
import { App } from '../../../App';
import { bootstrap } from '../../../bootstrap';
import { MailError } from '../MailError';
import { Module } from '../../Module';
import { coreModules } from '../../index';
import { ModuleProviderConstructor } from '../../../support/ModuleProvider';

describe('Mail', () => {
  describe('Module', () => {
    let app: App;

    const boot = (config?: Config, modules?: ModuleProviderConstructor[]) => {
      app = bootstrap(modules ?? coreModules, config, true);
      return app;
    };

    test('resolves fake smtp client in testing env', () => {
      boot({ env: Env.Testing });
      const clientFactory = app.get<SmtpClientFactory>(DIToken.SmtpClientFactory);
      expect(clientFactory({} as any)).toBeInstanceOf(FakeSmtpClient);
    });

    test('resolves smtp client ', () => {
      boot();
      const clientFactory = app.get<SmtpClientFactory>(DIToken.SmtpClientFactory);
      expect(clientFactory({} as any)).toBeInstanceOf(Nodemailer);
    });

    test('resolves fake mail transporter in testing env', () => {
      boot(({ env: Env.Testing }));
      const transporter = app.get(DIToken.FakeMailerTransporter);
      expect(transporter).toBeInstanceOf(FakeMailTransporter);
    });

    test('mailer should be singleton scoped', () => {
      boot();
      const mailerA = app.get<Mailer>(DIToken.Mailer);
      const mailerB = app.get<Mailer>(DIToken.Mailer);
      expect(mailerA).toBe(mailerB);
    });

    test('resolves all transporters', () => {
      Object.values(MailTransporterId).forEach((id) => {
        const config: Config = { [Module.Mail]: { transporter: id } };
        config[Module.Mail]![id] = {} as any;
        const cApp = boot(config);
        const transporter = cApp.get<MailTransporter>(DIToken.MailTransporter);
        const { constructor } = cApp
          .get<MailTransporterFactory>(DIToken.MailTransporterFactory)(id);
        expect(transporter).toBeInstanceOf(constructor);
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
              transporter: MailTransporterId.Mailgun,
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
            transporter: MailTransporterId.Smtp,
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
              transporter: MailTransporterId.Smtp,
              smtp: {} as any,
            },
          },
          [MailModule],
        );
      }).toThrow(MailError.MissingMailFrom);
    });

    test('returns correct smtp dependencies', () => {
      boot({ [Module.Mail]: { transporter: MailTransporterId.Smtp } });
      expect(new MailModule(app, {}).dependencies()).toEqual(['nodemailer']);
    });

    test('returns correct dependencies if not smtp', () => {
      boot({
        [Module.Mail]: {
          transporter: MailTransporterId.Mailgun,
          [MailTransporterId.Mailgun]: {} as any,
        },
      });
      expect(new MailModule(app, {})!.dependencies()).toEqual([]);
    });
  });
});
