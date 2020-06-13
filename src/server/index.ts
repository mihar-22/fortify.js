import 'reflect-metadata';
import { Config } from './Config';
import { bootstrap } from './bootstrap';
import { coreModules } from './modules';
import { ModuleProvider } from './support/ModuleProvider';

export default async function auth(
  config?: Config,
  modules?: ModuleProvider<any>[],
) {
  const app = await bootstrap([...coreModules, ...(modules ?? [])], config);
}
