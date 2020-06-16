import { MailModule } from '../../MailModule';
import { DIToken } from '../../../../DIToken';
import { Env } from '../../../../Config';
import { FakeSmtpClient, Smtp } from '../../transporters';
import { EventsModule } from '../../../events/EventsModule';
import { App } from '../../../../App';
import { bootstrap } from '../../../../bootstrap';
import { MailTransporter, MailTransporterFactory } from '../../Mailer';
import { Module } from '../../../Module';
import { LoggerModule } from '../../../logger/LoggerModule';

describe('Mail', () => {
  describe('Transporters', () => {
    describe('Smtp', () => {
      let app: App;
      let mailer: Smtp;
      let smtpClient: FakeSmtpClient;

      const mailRecipient = 'john_doe@localhost.com';
      const mailSender = 'Test App <no-reply@localhost.com>';
      const template = require.resolve('../fixtures/dummy-template.html');

      const mail = {
        subject: 'Subject',
        to: mailRecipient,
        text: 'Fresh email.',
        template,
        data: {
          firstName: 'John',
          lastName: 'Doe',
        },
      };

      beforeEach(async () => {
        app = await bootstrap([LoggerModule, EventsModule, MailModule], {
          env: Env.Testing,
          [Module.Mail]: {
            sandbox: false,
          },
        }, true);

        mailer = app.get<MailTransporterFactory>(
          DIToken.MailTransporterFactory,
        )(MailTransporter.Smtp) as Smtp;

        smtpClient = await app.get<() => FakeSmtpClient>(DIToken.SmtpClientFactory)();
      });

      test('sends mail', async () => {
        await mailer.send(mail);
        expect(smtpClient.sendMail).toHaveBeenCalledWith({
          subject: mail.subject,
          to: mail.to,
          text: mail.text,
          html: '<div>John Doe</div>',
          from: mailSender,
        });
      });
    });
  });
});
