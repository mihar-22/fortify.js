import 'reflect-metadata';
import { Config, Env } from './Config';
import { bootstrap } from './bootstrap';
import { coreModules } from './modules';
import { ModuleProvider } from './support/ModuleProvider';
import { DIToken } from './DIToken';
import { Endpoint } from './modules/http/api/Endpoint';
import { RequestHandler } from './modules/http/request/RequestHandler';

export * from './Config';

export type BuildOutput = { any: RequestHandler } & Record<Endpoint, RequestHandler>;

export function buildFortifyServer(
  config?: Config,
  modules?: ModuleProvider<any>[],
): BuildOutput | undefined {
  try {
    const app = bootstrap([...coreModules, ...(modules ?? [])], config);

    const output: any = {
      any: app.get<RequestHandler>(DIToken.HttpRequestHandler('*')),
    };

    Object.values(Endpoint).forEach((endpoint) => {
      output[endpoint] = app.get(DIToken.HttpRequestHandler(endpoint));
    });

    // @TODO: resolve middleware.

    return output as BuildOutput;
  } catch (e) {
    if (config?.env !== Env.Production) { throw e; }
    return undefined;
  }
}
