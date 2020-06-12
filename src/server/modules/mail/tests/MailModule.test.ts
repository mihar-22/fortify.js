import { Container } from 'inversify';
import Mail from 'nodemailer/lib/mailer';
import { DIToken } from '../../../DIToken';
import { LoggerModule } from '../../logger/LoggerModule';
import { Config, Env } from '../../../Config';
import { EventsModule } from '../../events/EventsModule';
import { SmtpClientProvider } from '../SmtpClient';
import { FakeSmtpClient } from '../FakeSmtpClient';
import { MailModule } from '../MailModule';
import { MailErrorCode } from '../MailError';
import {
  Mailer, MailerConstructor, MailSenderFactory, MailTransporter,
} from '../Mailer';
import { FakeMailer } from '../FakeMailer';
import { Mailgun, SendGrid, Smtp } from '../transporters';
import { HttpModule } from '../../http/HttpModule';

describe('Mail', () => {
  describe('Module', () => {
    let container: Container;

    const getModules = () => [LoggerModule, HttpModule, EventsModule, MailModule];

    const loadModule = async (config?: Config) => {
      container = new Container();
      container.bind(DIToken.Config).toConstantValue(config ?? {});
      await container.loadAsync(...getModules());
    };

    test('resolves fake smtp client in testing env', async () => {
      await loadModule(({ env: Env.Testing }));
      const smtpClientProvider = container.get<SmtpClientProvider>(DIToken.SmtpClientProvider);
      expect(await smtpClientProvider()).toBeInstanceOf(FakeSmtpClient);
    });

    test('resolves smtp client ', async () => {
      await loadModule(({
        mail: {
          smtp: {
            host: 'smtp.ethereal.email',
            port: 587,
            username: 'Maeve Hagenes',
            password: 'maeve.hagenes@ethereal.email',
          },
        },
      }));
      const smtpClientProvider = container.get<SmtpClientProvider>(DIToken.SmtpClientProvider);
      const smtpClient = await smtpClientProvider();
      expect(smtpClient).toBeInstanceOf(Mail);
    });

    test('should throw in production if smtp config is missing', async () => {
      await loadModule(({ env: Env.Production }));
      const smtpClientProvider = container.get<SmtpClientProvider>(DIToken.SmtpClientProvider);
      await expect(smtpClientProvider()).rejects.toThrow(MailErrorCode.MissingSmtpConfig);
    });

    test('should throw in production if from config is missing', async () => {
      await loadModule(({ env: Env.Production }));
      const senderFactory = container.get<MailSenderFactory>(DIToken.MailSenderFactory);
      expect(() => senderFactory()).toThrow(MailErrorCode.MissingFromConfig);
    });

    test('should resolve fake sender in development/testing', async () => {
      const fakeSender = 'Test App <no-reply@localhost.com>';
      await loadModule({ env: Env.Development });
      const devSenderFactory = container.get<MailSenderFactory>(DIToken.MailSenderFactory);
      expect(devSenderFactory()).toBe(fakeSender);
      await loadModule({ env: Env.Testing });
      const testSenderFactory = container.get<MailSenderFactory>(DIToken.MailSenderFactory);
      expect(testSenderFactory()).toBe(fakeSender);
    });

    test('resolves fake mailer in testing env', async () => {
      await loadModule(({ env: Env.Testing }));
      const mailer = container.get<Mailer>(DIToken.Mailer);
      expect(mailer).toBeInstanceOf(FakeMailer);
    });

    test('mailer should be singleton scoped', async () => {
      await loadModule();
      const mailerA = container.get<Mailer>(DIToken.Mailer);
      const mailerB = container.get<Mailer>(DIToken.Mailer);
      expect(mailerA).toBe(mailerB);
    });

    test('resolves all transporters', async () => {
      const transporters: Record<MailTransporter, MailerConstructor> = {
        [MailTransporter.Smtp]: Smtp,
        [MailTransporter.Mailgun]: Mailgun,
        [MailTransporter.SendGird]: SendGrid,
      };

      await Promise.all(Object.values(MailTransporter).map(async (transporter) => {
        // eslint-disable-next-line no-shadow
        const container = new Container();
        container.bind<Config>(DIToken.Config).toConstantValue({ mail: { transporter } });
        await container.loadAsync(...getModules());
        const mailer = container.get<Mailer>(DIToken.Mailer);
        expect(mailer).toBeInstanceOf(transporters[transporter]);
      }));
    });
  });
});
