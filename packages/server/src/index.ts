import '@abraham/reflection';
import { bootstrap } from './bootstrap';
import { DIToken } from './DIToken';
import { Endpoint } from './modules/http/api/Endpoint';
import { MailEvent } from './modules/mail/MailEvent';
import { DatabaseEvent } from './modules/database/DatabaseEvent';
import { EncryptionEvent } from './modules/encryption/EncryptionEvent';
import { HttpEvent } from './modules/http/HttpEvent';
import { RequestHandler } from './modules/http/request/RequestHandler';
import { coreModules } from './modules';
import { Config } from './Config';

export * from './Config';

export {
  MailEvent,
  HttpEvent,
  EncryptionEvent,
  DatabaseEvent,
};

export type FortifyServer = { any: RequestHandler } & Record<Endpoint, RequestHandler>;

export function buildFortifyServer(config?: Config): FortifyServer {
  const app = bootstrap(coreModules, config);

  const server: any = {
    any: app.get(DIToken.HttpRequestHandler('*')),
  };

  Object.values(Endpoint).forEach((endpoint) => {
    server[endpoint] = app.get(DIToken.HttpRequestHandler(endpoint));
  });

  // @TODO: export middleware.

  return server as FortifyServer;
}
