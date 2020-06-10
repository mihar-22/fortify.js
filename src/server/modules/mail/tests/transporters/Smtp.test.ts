import { Container } from 'inversify';
import { MailModule } from '../../MailModule';
import { Mailer } from '../../Mailer';
import { DIToken } from '../../../../DIToken';
import { FakeDispatcher } from '../../../events/FakeDispatcher';
import { FakeLogger } from '../../../logger/FakeLogger';
import { Config, Env } from '../../../../Config';
import { FakeSmtpClient } from '../../FakeSmtpClient';
import { LoggerModule } from '../../../logger/LoggerModule';
import { EventsModule } from '../../../events/EventsModule';
import { Smtp } from '../../transporters';

describe('Mail', () => {
  describe('Transporters', () => {
    describe('Smtp', () => {
      let container: Container;
      let mailer: Mailer;
      let logger: FakeLogger;
      let events: FakeDispatcher;
      let smtpClient: FakeSmtpClient;

      const mailSender = 'Test <no-reply@test.com>';

      beforeEach(async () => {
        container = new Container();
        container.bind<Config>(DIToken.Config).toConstantValue({ env: Env.Testing });
        await container.loadAsync(LoggerModule, EventsModule, MailModule);

        container.unbind(DIToken.MailSenderFactory);
        container.bind(DIToken.MailSenderFactory).toFactory<string>(() => () => mailSender);

        mailer = container.resolve(Smtp);
        logger = container.get(DIToken.Logger);
        events = container.get(DIToken.EventDispatcher);
        smtpClient = await container.get<any>(DIToken.SmtpClientProvider)();
      });

      test('hm', async () => {
        const mail = { subject: 'Subject', to: 'john@example.com', text: 'Fresh email.' };
        // console.log(await mailer.send(mail));
        // expect(smtpClient.sendMail).toHaveBeenCalledWith({
        //   ...mail,
        //   html: undefined,
        //   from: mailSender,
        // });
        // expect(events.dispatch).toHaveBeenCalledWith(MailEventCode.MailSending, mai);
      });
    });
  });
});
