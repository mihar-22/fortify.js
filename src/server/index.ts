import 'reflect-metadata';
import { Config } from './Config';
import { bootstrap } from './bootstrap';
import { coreModules } from './modules';
import { ModuleProvider } from './support/ModuleProvider';

// @TODO: Export -> DIToken | Config | {Module}Event | Generic Data Types

// Export initialize func.

export async function authServer(
  config?: Config,
  modules?: ModuleProvider<any>[],
) {
  // Fetch config from post-initialization cache.
  const app = await bootstrap([...coreModules, ...(modules ?? [])], config);
}

// Export middleware -> Fetch config from post-initialization cache.
