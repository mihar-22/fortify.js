import { inject, injectable } from 'inversify';
import { Mail, Mailer } from '../Mailer';
import Dispatcher from '../../events/Dispatcher';
import DIToken from '../../../DIToken';
import { SmtpProvider } from '../MailModule';

@injectable()
export default class SmtpMailer implements Mailer {
  private readonly clientProvider: SmtpProvider;

  private readonly sender: string;

  private readonly events: Dispatcher;

  constructor(
  @inject(DIToken.SmtpClientProvider) clientProvider: SmtpProvider,
    @inject(DIToken.EventDispatcher) events: Dispatcher,
    @inject(DIToken.MailSender) sender: string,
  ) {
    this.clientProvider = clientProvider;
    this.events = events;
    this.sender = sender;

    console.log(clientProvider);
    console.log(sender);
  }

  public async send<T>(mail: Mail<T>) {
    // if there is a template we need to grab it.
    console.log(mail);

    // this.events.dispatch(MailEvent.MailSending, mail);
    // const info = await this.client.sendMail({ from: this.sender, ...mail });
    // this.events.dispatch(MailEvent.MailSent, { mail, info });
  }
}
