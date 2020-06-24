import { readFileSync, existsSync } from 'fs';
import { Config } from './Config';
import { ConfigurationError, DependenciesMissingError } from './support/errors';
import { App } from './App';
import { mergeObjDeep } from './utils';
import { ModuleProvider, ModuleProviderConstructor } from './support/ModuleProvider';

interface Pkg {
  name?: string
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

let cachedApp: App;

export function bootstrap(
  modules: ModuleProviderConstructor[],
  config?: Config,
  fresh = false,
  testModules?: ModuleProviderConstructor[],
): App {
  if (cachedApp && !fresh) { return cachedApp; }

  const app = new App(config ?? {});
  const skipChecks = config?.skipBootChecks ?? false;

  // 1. Initialize each module config with defaults.
  modules.forEach((Module) => {
    app.setConfig(
      Module.id,
      mergeObjDeep(Module.defaults?.(app) ?? {}, app.getConfig(Module.id) ?? {}),
    );
  });

  // 2. Initialize each module.
  const mods: ModuleProvider<any>[] = modules
    .map((Module) => new Module(app, app.getConfig(Module.id)));

  if (!skipChecks) {
    // 3. Validate each module config.
    mods.forEach((mod) => {
      const invalidConfiguration = mod.configValidation?.();

      if (invalidConfiguration) {
        const invalidPath = `config.${(mod.constructor as ModuleProviderConstructor).id}`
          + `${invalidConfiguration.path ? `.${invalidConfiguration.path}` : ''}`;

        throw new ConfigurationError(
          invalidConfiguration.code,
          invalidConfiguration.message,
          invalidPath,
          (mod.constructor as ModuleProviderConstructor).id,
          invalidConfiguration.link,
        );
      }
    });

    // 4. Ensure all module dependencies have been installed.
    const pkgPath = `${process.cwd()}/package.json`;
    const pkg: Pkg = existsSync(pkgPath) ? JSON.parse(readFileSync(pkgPath).toString('utf-8')) : {};
    const isHomePkg = pkg.name?.includes('fortify.js');
    if (!isHomePkg) {
      const missingDeps: string[] = [];

      mods.forEach((mod) => {
        const dependencies = mod.dependencies?.();

        if (dependencies) {
          dependencies?.forEach((dependency) => {
            const hasDep = Object.prototype.hasOwnProperty.call(pkg.dependencies ?? {}, dependency);
            if (!hasDep) { missingDeps.push(dependency); }
          });
        }
      });

      if (missingDeps.length > 0) { throw new DependenciesMissingError(missingDeps); }
    }
  }

  // 5. Register all module bindings.
  mods.forEach((mod) => { mod.register(); });

  // 6. If testing environment, register all test bindings.
  if (app.isTestingEnv) {
    mods.forEach((mod) => { mod.registerTestingEnv?.(); });
  }

  // 6.1. Additional overrides if testing any module but not setting app to testing environment.
  testModules
    ?.filter((Module) => !app.isTestingEnv || !modules.includes(Module))
    .map((Module) => new Module(app, app.getConfig(Module.id)))
    .forEach((mod) => { mod.registerTestingEnv?.(); });

  // 7. Boot all modules.
  mods.forEach((mod) => mod.boot?.());

  cachedApp = app;
  return app;
}
