import 'reflect-metadata';
import { Config, Env } from './Config';
import { bootstrap } from './bootstrap';
import { coreModules } from './modules';
import { ModuleProvider } from './support/ModuleProvider';

// @TODO: Export -> DIToken | Config | {Module}Event | Generic Data Types

export function buildAuthServer(
  config?: Config,
  modules?: ModuleProvider<any>[],
) {
  try {
    const app = bootstrap([...coreModules, ...(modules ?? [])], config);

    // @TODO: resolve and return router + routes + middleware.
    return {};
  } catch (e) {
    const env = config?.env ?? Env.Development;
    if (env !== Env.Production) { throw e; }
  }
}
