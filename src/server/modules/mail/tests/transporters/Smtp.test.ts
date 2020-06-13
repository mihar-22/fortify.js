import { MailModule } from '../../MailModule';
import { Mailer } from '../../Mailer';
import { DIToken } from '../../../../DIToken';
import { FakeDispatcher } from '../../../events/FakeDispatcher';
import { Env } from '../../../../Config';
import { FakeSmtpClient, Smtp } from '../../transporters';
import { EventsModule } from '../../../events/EventsModule';
import { MailEvent, MailEventCode } from '../../MailEvent';
import { App } from '../../../../App';
import { bootstrap } from '../../../../bootstrap';

describe('Mail', () => {
  describe('Transporters', () => {
    describe('Smtp', () => {
      let app: App;
      let mailer: Mailer;
      let events: FakeDispatcher;
      let smtpClient: FakeSmtpClient;

      const mailRecipient = 'john_doe@localhost.com';
      const mailSender = 'Test App <no-reply@localhost.com>';
      const template = require.resolve('../fixtures/dummy-template.html');

      beforeEach(async () => {
        app = await bootstrap([EventsModule, MailModule], { env: Env.Testing }, true);
        mailer = app.resolve(Smtp);
        events = app.get(DIToken.EventDispatcher);
        smtpClient = await app.get<any>(DIToken.SmtpClientProvider)();
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
