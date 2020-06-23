import '@abraham/reflection';
import { Config, Env } from './Config';
import { bootstrap } from './bootstrap';
import { coreModules } from './modules';
import { ModuleProvider } from './support/ModuleProvider';
import { DIToken } from './DIToken';
import { Endpoint } from './modules/http/api/Endpoint';
import { RequestHandler } from './modules/http/request/RequestHandler';
import { MailEvent } from './modules/mail/MailEvent';
import { EncryptionEvent } from './modules/encryption/EncryptionEvent';
import { HttpEvent } from './modules/http/HttpEvent';

export * from './Config';
export * from './DIToken';

export {
  MailEvent,
  HttpEvent,
  EncryptionEvent,
};

export type FortifyServer = { any: RequestHandler } & Record<Endpoint, RequestHandler>;

export function buildFortifyServer(
  config?: Config,
  modules?: ModuleProvider<any>[],
): FortifyServer {
  try {
    const app = bootstrap([...coreModules, ...(modules ?? [])], config);

    const output: any = {
      any: app.get(DIToken.HttpRequestHandler('*')),
    };

    Object.values(Endpoint).forEach((endpoint) => {
      output[endpoint] = app.get(DIToken.HttpRequestHandler(endpoint));
    });

    // @TODO: export middleware.

    return output as FortifyServer;
  } catch (e) {
    if (config?.env !== Env.Production) { throw e; }
    return {} as FortifyServer;
  }
}
