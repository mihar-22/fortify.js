import { readFileSync, existsSync } from 'fs';
import { Config } from './Config';
import { ConfigurationError, DependenciesMissingError } from './support/errors';
import { App } from './App';
import { mergeObjDeep } from './utils';
import { ModuleProvider } from './support/ModuleProvider';

interface Pkg {
  name?: string
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

let cachedApp: App;

export function bootstrap(
  modules: ModuleProvider<any>[],
  config?: Config,
  fresh = false,
  testModules?: ModuleProvider<any>[],
): App {
  if (cachedApp && !fresh) { return cachedApp; }

  const app = new App(config ?? {});
  const skipChecks = config?.skipBootChecks ?? false;

  if (!skipChecks) {
    // 1. Initialize each module config with defaults.
    modules.forEach((Module) => {
      app.setConfig(
        Module.module,
        mergeObjDeep(Module.defaults?.(app) ?? {}, app.getConfig(Module.module) ?? {}),
      );
    });

    // 2. Validate each module config.
    modules.forEach((Module) => {
      const invalidConfiguration = Module.configValidation?.(app);

      if (invalidConfiguration) {
        const invalidPath = `config.${Module.module}`
          + `${invalidConfiguration.path ? `.${invalidConfiguration.path}` : ''}`;

        throw new ConfigurationError(
          invalidConfiguration.code,
          invalidConfiguration.message,
          invalidPath,
          Module.module,
          invalidConfiguration.link,
        );
      }
    });

    // 3. Ensure all module dependencies have been installed.
    const pkgPath = `${process.cwd()}/package.json`;
    const pkg: Pkg = existsSync(pkgPath) ? JSON.parse(readFileSync(pkgPath).toString('utf-8')) : {};
    const isHomePkg = pkg.name?.includes('fortify.js');
    if (!isHomePkg) {
      modules.forEach((Module) => {
        const missingDeps: string[] = [];
        const dependencies = Module.dependencies?.(app);
        dependencies?.forEach((dependency) => {
          const hasDep = Object.prototype.hasOwnProperty.call(pkg.dependencies ?? {}, dependency);
          if (!hasDep) { missingDeps.push(dependency); }
        });
        if (missingDeps.length > 0) {
          throw new DependenciesMissingError(missingDeps, Module.module);
        }
      });
    }
  }

  // 4. Register all module bindings.
  modules.forEach((Module) => { Module.register(app); });

  // 5. If testing environment, register all test bindings.
  if (app.isTestingEnv) {
    modules.forEach((Module) => { Module.registerTestingEnv?.(app); });
  }

  // 5.1. Additional overrides if testing any module but not setting app to testing environment.
  testModules?.forEach((Module) => { Module.registerTestingEnv?.(app); });

  // 6. Boot all modules.
  modules.map((Module) => Module.boot?.(app));

  return app;
}
