import { App } from '../../../../App';
import { bootstrap } from '../../../../bootstrap';
import { EventsModule } from '../../../events/EventsModule';
import { MailModule } from '../../MailModule';
import { Mailgun } from '../../transporters';
import { HttpModule } from '../../../http/HttpModule';
import { DIToken } from '../../../../DIToken';
import { LoggerModule } from '../../../logger/LoggerModule';
import { Env } from '../../../../Config';
import { FakeHttpClient } from '../../../http/FakeHttpClient';

describe('Mail', () => {
  describe('Transporters', () => {
    describe('Mailgun', () => {
      let app: App;
      let mailer: Mailgun;
      let httpClient: FakeHttpClient;

      const mailRecipient = 'john_doe@localhost.com';
      // const mailSender = 'Test App <no-reply@localhost.com>';

      beforeEach(async () => {
        app = await bootstrap(
          [LoggerModule, HttpModule, EventsModule, MailModule],
          { env: Env.Testing },
          true,
        );
        mailer = app.resolve(Mailgun);
        httpClient = app.get(DIToken.HttpClient);
      });

      test('sends mail', async () => {
        httpClient.post(/api\.mailgun\.net/, { message: '' });

        // const response = await mailer.send({
        //   to: mailRecipient,
        //   subject: 'Subject',
        //   text: 'apples',
        // });

        // ...
      });
    });
  });
});
