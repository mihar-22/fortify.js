import { Container } from 'inversify';
import { MailModule } from '../../MailModule';
import { Mailer } from '../../Mailer';
import { DIToken } from '../../../../DIToken';
import { FakeDispatcher } from '../../../events/FakeDispatcher';
import { Config, Env } from '../../../../Config';
import { FakeSmtpClient } from '../../FakeSmtpClient';
import { EventsModule } from '../../../events/EventsModule';
import { Smtp } from '../../transporters';
import { MailEvent, MailEventCode } from '../../MailEvent';

describe('Mail', () => {
  describe('Transporters', () => {
    describe('Smtp', () => {
      let container: Container;
      let mailer: Mailer;
      let events: FakeDispatcher;
      let smtpClient: FakeSmtpClient;

      const mailRecipient = 'john_doe@localhost.com';
      const mailSender = 'Test App <no-reply@localhost.com>';
      const template = require.resolve('../fixtures/dummy-template.html');

      beforeEach(async () => {
        container = new Container();
        container.bind<Config>(DIToken.Config).toConstantValue({ env: Env.Testing });
        await container.loadAsync(EventsModule, MailModule);
        mailer = container.resolve(Smtp);
        events = container.get(DIToken.EventDispatcher);
        smtpClient = await container.get<any>(DIToken.SmtpClientProvider)();
      });

      test('sends raw text', async () => {
        const mail = {
          subject: 'Subject',
          to: mailRecipient,
          text: 'Fresh email.',
        };
        await mailer.send(mail);
        expect(smtpClient.sendMail).toHaveBeenCalledWith({
          ...mail,
          html: undefined,
          from: mailSender,
        });
        expect(events.dispatch).toHaveBeenCalledWith(
          MailEvent[MailEventCode.MailSending]({ mail }),
        );
        expect(events.dispatch).toHaveBeenCalledWith(
          // @ts-ignore
          MailEvent[MailEventCode.MailSent]({ mail, previewUrl: undefined }),
        );
      });

      test('builds html template and sends it', async () => {
        const mail = {
          subject: 'Subject',
          to: mailRecipient,
          template,
          data: {
            firstName: 'John',
            lastName: 'Doe',
          },
        };
        await mailer.send(mail);
        expect(smtpClient.sendMail).toHaveBeenCalledWith({
          from: mailSender,
          subject: mail.subject,
          to: mail.to,
          html: expect.stringContaining('<div>John Doe</div>'),
          text: undefined,
        });
        expect(events.dispatch).toHaveBeenCalledWith(
          MailEvent[MailEventCode.MailSending]({ mail }),
        );
        expect(events.dispatch).toHaveBeenCalledWith(
          // @ts-ignore
          MailEvent[MailEventCode.MailSent]({ mail, previewUrl: undefined }),
        );
      });
    });
  });
});
