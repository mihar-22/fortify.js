import 'reflect-metadata';
import { Config } from './Config';
import { bootstrap } from './bootstrap';
import { coreModules } from './modules';
import { ModuleProvider } from './support/ModuleProvider';

// @TODO: Export -> DIToken | Config | {Module}Event | Generic Data Types

export function buildAuthServer(
  config?: Config,
  modules?: ModuleProvider<any>[],
) {
  const app = bootstrap([...coreModules, ...(modules ?? [])], config);

  return {
    // routes (catch all as well)
    // middleware
  };
}
